import React, { useState, useEffect, useRef, useCallback } from 'react';
import { obtenerVentas, guardarVenta, eliminarVenta } from '../services/ventas';
import { obtenerProductos, actualizarProducto } from '../services/productos';
import { useAuth } from '../context/AuthContext';
import { formatCOP, formatTime } from '../utils/format';

// ──────────────────────────────────────────────
// MÉTODOS DE PAGO con ícono y color
// ──────────────────────────────────────────────
const METODOS_PAGO = [
    { key: 'Efectivo', icon: '💵', color: 'bg-green-500 text-white', border: 'border-green-500' },
    { key: 'Tarjeta', icon: '💳', color: 'bg-blue-500 text-white', border: 'border-blue-500' },
    { key: 'Nequi', icon: '📱', color: 'bg-purple-500 text-white', border: 'border-purple-500' },
    { key: 'Transferencia', icon: '🏦', color: 'bg-yellow-500 text-white', border: 'border-yellow-500' },
];

// ──────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────
const Ventas = () => {
    const { currentUser } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    // Carrito: array de { producto, cantidad, precio, subtotal }
    const [carrito, setCarrito] = useState([]);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [busqueda, setBusqueda] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Para feedback visual tras venta exitosa
    const [ultimaVenta, setUltimaVenta] = useState(null);

    const searchRef = useRef(null);

    // ── Cargar datos iniciales
    const cargarDatos = useCallback(async () => {
        setLoadingData(true);
        try {
            const [listaVentas, listaProductos] = await Promise.all([
                obtenerVentas(),
                obtenerProductos()
            ]);
            setVentas(listaVentas);
            setProductos(listaProductos);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    // Focar búsqueda al cargar
    useEffect(() => {
        if (!loadingData && searchRef.current) searchRef.current.focus();
    }, [loadingData]);

    // ── Filtrado de productos para autocomplete
    const sugerencias = busqueda.length > 0
        ? productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        ).slice(0, 8)
        : [];

    // ── Agregar al carrito
    const agregarProducto = (prod) => {
        setBusqueda('');
        setShowSuggestions(false);
        setCarrito(prev => {
            const idx = prev.findIndex(i => i.id === prod.id);
            if (idx >= 0) {
                // Ya existe: incrementar cantidad
                const updated = [...prev];
                const nuevo = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
                nuevo.subtotal = nuevo.cantidad * nuevo.precio;
                updated[idx] = nuevo;
                return updated;
            }
            return [...prev, {
                id: prod.id,
                producto: prod.nombre,
                precio: prod.precioVenta,
                cantidad: 1,
                subtotal: prod.precioVenta,
                stockDisponible: prod.stock || 0,
            }];
        });
        searchRef.current?.focus();
    };

    // ── Cambiar cantidad en el carrito
    const cambiarCantidad = (id, delta) => {
        setCarrito(prev => prev
            .map(item => {
                if (item.id !== id) return item;
                const nuevaCant = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: nuevaCant, subtotal: nuevaCant * item.precio };
            })
        );
    };

    const setCantidadDirecta = (id, valor) => {
        const num = Math.max(1, parseInt(valor) || 1);
        setCarrito(prev => prev.map(item =>
            item.id === id ? { ...item, cantidad: num, subtotal: num * item.precio } : item
        ));
    };

    // ── Quitar del carrito
    const quitarItem = (id) => setCarrito(prev => prev.filter(i => i.id !== id));

    // ── Total del carrito
    const totalCarrito = carrito.reduce((s, i) => s + i.subtotal, 0);

    // ── Registrar venta (todos los items del carrito en una sola operación)
    const handleRegistrarVenta = async () => {
        if (carrito.length === 0) return;

        // Validar stock por item
        for (const item of carrito) {
            const prod = productos.find(p => p.id === item.id);
            if (prod && (prod.stock || 0) < item.cantidad) {
                return alert(`Stock insuficiente para "${item.producto}". Disponible: ${prod.stock || 0} u.`);
            }
        }

        setSaving(true);
        try {
            // Guardar una venta por item (compatible con el historial actual)
            for (const item of carrito) {
                const ventaData = {
                    producto: item.producto,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    total: item.subtotal,
                    pago: metodoPago,
                    usuario: currentUser?.email || 'admin',
                    fecha: new Date().toISOString(),
                };
                await guardarVenta(ventaData);

                // Descontar stock
                const prod = productos.find(p => p.id === item.id);
                if (prod) {
                    await actualizarProducto(prod.id, {
                        stock: Math.max(0, (prod.stock || 0) - item.cantidad)
                    });
                }
            }

            // Feedback visual
            setUltimaVenta({ total: totalCarrito, items: carrito.length, pago: metodoPago });
            setCarrito([]);
            setBusqueda('');
            setTimeout(() => setUltimaVenta(null), 4000);
            cargarDatos();
            searchRef.current?.focus();
        } catch (error) {
            console.error(error);
            alert("Error al registrar la venta: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Enter para confirmar venta desde el buscador
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && sugerencias.length === 1) {
            e.preventDefault();
            agregarProducto(sugerencias[0]);
        }
        if (e.key === 'Escape') {
            setBusqueda('');
            setShowSuggestions(false);
        }
    };

    const handleDelete = async (venta) => {
        if (!confirm('¿Eliminar esta venta? Se restaurará el stock.')) return;
        try {
            await eliminarVenta(venta.id);
            if (venta.producto !== 'Otro') {
                const prod = productos.find(p => p.nombre === venta.producto);
                if (prod) await actualizarProducto(prod.id, { stock: (prod.stock || 0) + Number(venta.cantidad) });
            }
            cargarDatos();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar: " + error.message);
        }
    };

    // ── COLORES para método de pago en historial
    const pagoColor = (pago) => {
        const m = { Efectivo: 'bg-green-100 text-green-700', Tarjeta: 'bg-blue-100 text-blue-700', Nequi: 'bg-purple-100 text-purple-700', Transferencia: 'bg-yellow-100 text-yellow-700' };
        return m[pago] || 'bg-gray-100 text-gray-600';
    };

    // ── RENDER
    return (
        <div className="flex flex-col lg:flex-row gap-4 h-full">

            {/* ── PANEL IZQUIERDO: POS ── */}
            <div className="w-full lg:w-96 flex-shrink-0 space-y-3">

                {/* Buscador de productos */}
                <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4">
                    <h2 className="text-lg font-bold text-pink-700 mb-3 flex items-center gap-2">
                        🛒 Nueva Venta
                    </h2>

                    <div className="relative">
                        <div className="flex items-center gap-2 border-2 border-pink-300 focus-within:border-pink-500 rounded-xl px-3 py-2 bg-pink-50 transition">
                            <span className="text-pink-400 text-lg">🔍</span>
                            <input
                                ref={searchRef}
                                type="text"
                                value={busqueda}
                                onChange={e => { setBusqueda(e.target.value); setShowSuggestions(true); }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                placeholder="Buscar producto... (Enter si hay 1 resultado)"
                                className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700"
                            />
                            {busqueda && (
                                <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600">✕</button>
                            )}
                        </div>

                        {/* Autocompletado */}
                        {showSuggestions && sugerencias.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50 overflow-hidden">
                                {sugerencias.map(p => (
                                    <button
                                        key={p.id}
                                        onMouseDown={() => agregarProducto(p)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-pink-50 text-left border-b border-gray-50 last:border-none"
                                    >
                                        <div>
                                            <span className="font-medium text-gray-800 text-sm">{p.nombre}</span>
                                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${(p.stock || 0) < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {p.stock || 0} u.
                                            </span>
                                        </div>
                                        <span className="font-bold text-pink-600 text-sm">{formatCOP(p.precioVenta)}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Grid de productos recientes / top products */}
                    {busqueda.length === 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                            {productos.slice(0, 12).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => agregarProducto(p)}
                                    className="flex flex-col items-center p-2 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-300 transition text-center"
                                >
                                    <span className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2">{p.nombre}</span>
                                    <span className="text-xs text-pink-600 font-bold mt-1">{formatCOP(p.precioVenta)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Carrito */}
                {carrito.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                            <span className="font-bold text-gray-700 text-sm">🧾 Carrito ({carrito.length} ítems)</span>
                            <button onClick={() => setCarrito([])} className="text-xs text-red-400 hover:text-red-600">Vaciar</button>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                            {carrito.map(item => (
                                <div key={item.id} className="flex items-center gap-2 px-3 py-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.producto}</p>
                                        <p className="text-xs text-gray-400">{formatCOP(item.precio)} c/u</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => cambiarCantidad(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-pink-100 text-gray-600 font-bold text-sm flex items-center justify-center">-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={e => setCantidadDirecta(item.id, e.target.value)}
                                            className="w-10 text-center text-sm font-bold border rounded outline-none"
                                        />
                                        <button onClick={() => cambiarCantidad(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-pink-100 text-gray-600 font-bold text-sm flex items-center justify-center">+</button>
                                    </div>
                                    <span className="font-bold text-pink-600 text-sm w-20 text-right">{formatCOP(item.subtotal)}</span>
                                    <button onClick={() => quitarItem(item.id)} className="text-red-300 hover:text-red-500 text-sm">✕</button>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="px-4 py-3 border-t border-gray-100 bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 font-semibold">TOTAL:</span>
                                <span className="text-3xl font-black text-pink-600">{formatCOP(totalCarrito)}</span>
                            </div>

                            {/* Método de pago */}
                            <div className="grid grid-cols-4 gap-1.5 mb-3">
                                {METODOS_PAGO.map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setMetodoPago(m.key)}
                                        className={`flex flex-col items-center py-1.5 rounded-lg border-2 text-xs font-bold transition ${metodoPago === m.key ? m.color + ' ' + m.border : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <span className="text-base">{m.icon}</span>
                                        <span className="hidden sm:block">{m.key}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleRegistrarVenta}
                                disabled={saving}
                                className={`w-full py-3 rounded-xl font-black text-lg shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                            >
                                {saving ? '⏳ Guardando...' : `✅ Cobrar ${formatCOP(totalCarrito)}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Feedback de última venta */}
                {ultimaVenta && (
                    <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center animate-pulse">
                        <p className="text-green-700 font-bold text-lg">✅ Venta registrada</p>
                        <p className="text-green-600">{formatCOP(ultimaVenta.total)} · {ultimaVenta.items} ítem(s) · {ultimaVenta.pago}</p>
                    </div>
                )}
            </div>

            {/* ── PANEL DERECHO: HISTORIAL ── */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 text-lg">📋 Últimas Ventas</h2>
                    <span className="text-sm text-gray-400">{ventas.length} registros</span>
                </div>

                {loadingData ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full" />
                    </div>
                ) : ventas.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-4xl mb-3">🛒</p>
                        <p>No hay ventas registradas hoy</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase bg-gray-50 border-b">
                                    <th className="px-4 py-3">Hora</th>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3">Cant.</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Pago</th>
                                    <th className="px-4 py-3 text-right">–</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ventas.map((v) => (
                                    <tr key={v.id} className="hover:bg-pink-50 transition-colors">
                                        <td className="px-4 py-2.5 text-sm text-gray-500">{formatTime(v.fecha)}</td>
                                        <td className="px-4 py-2.5 font-medium text-gray-800 max-w-[150px] truncate">{v.producto}</td>
                                        <td className="px-4 py-2.5 text-gray-600">{v.cantidad}</td>
                                        <td className="px-4 py-2.5 font-bold text-pink-600">{formatCOP(v.total)}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pagoColor(v.pago)}`}>{v.pago}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button
                                                onClick={() => handleDelete(v)}
                                                className="text-red-300 hover:text-red-600 transition text-sm"
                                                title="Eliminar venta"
                                            >🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ventas;

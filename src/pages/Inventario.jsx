import React, { useState, useEffect, useCallback } from 'react';
import { obtenerProductos, actualizarProducto } from '../services/productos';
import { formatCOP } from '../utils/format';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [editandoStock, setEditandoStock] = useState(null);
    const [nuevoStock, setNuevoStock] = useState(0);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const data = await obtenerProductos();
            setProductos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const iniciarEdicion = (p) => {
        setEditandoStock(p.id);
        setNuevoStock(p.stock || 0);
    };

    const guardarStock = async (id) => {
        await actualizarProducto(id, { stock: Number(nuevoStock) });
        setEditandoStock(null);
        cargar();
    };

    const filtrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const getStockLabel = (stock) => {
        const s = stock || 0;
        if (s === 0) return { label: 'Sin Stock', cls: 'bg-red-100 text-red-700 border border-red-200' };
        if (s < 5) return { label: 'Crítico', cls: 'bg-orange-100 text-orange-700 border border-orange-200' };
        if (s < 20) return { label: 'Bajo', cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200' };
        return { label: 'OK', cls: 'bg-green-100 text-green-700 border border-green-200' };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">📦 Control de Inventario</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full sm:w-64 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button onClick={cargar} className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-medium transition">
                        🔄 Actualizar
                    </button>
                </div>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Productos', value: productos.length, color: 'text-blue-600' },
                    { label: 'Sin Stock', value: productos.filter(p => !p.stock || p.stock === 0).length, color: 'text-red-600' },
                    { label: 'Stock Crítico', value: productos.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5).length, color: 'text-orange-600' },
                    { label: 'Con Stock OK', value: productos.filter(p => (p.stock || 0) >= 20).length, color: 'text-green-600' },
                ].map(card => (
                    <div key={card.label} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Editar Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400">Cargando inventario...</td></tr>
                            ) : filtrados.map(p => {
                                const { label, cls } = getStockLabel(p.stock);
                                return (
                                    <tr key={p.id} className="hover:bg-pink-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{p.categoria || '-'}</td>
                                        <td className="px-4 py-3 font-bold text-pink-600">{formatCOP(p.precioVenta)}</td>
                                        <td className="px-4 py-3">
                                            {editandoStock === p.id ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={nuevoStock}
                                                        onChange={e => setNuevoStock(e.target.value)}
                                                        className="w-20 border rounded px-2 py-1 text-sm"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => guardarStock(p.id)} className="text-green-600 hover:text-green-800 text-sm">✅</button>
                                                    <button onClick={() => setEditandoStock(null)} className="text-red-400 hover:text-red-600 text-sm">✖</button>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-700">{p.stock || 0} u.</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${cls}`}>{label}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => iniciarEdicion(p)}
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                            >
                                                ✏️ Ajustar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!loading && filtrados.length === 0 && (
                        <p className="text-center py-10 text-gray-400">No hay productos.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventario;

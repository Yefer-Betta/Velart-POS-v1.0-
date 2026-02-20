import React, { useState, useEffect } from 'react';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../services/productos';
import { motion } from 'framer-motion';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);   // para la tabla
    const [saving, setSaving] = useState(false);     // para el botón guardar
    const [modoEdicion, setModoEdicion] = useState(null);

    const [form, setForm] = useState({
        nombre: '',
        precioVenta: 0,
        precioCompra: 0,
        stock: 0,
        categoria: '',
        unidad: 'unidad'
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        setLoading(true);
        try {
            const data = await obtenerProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: rechaza si Firebase tarda más de 10 segundos
    const withTimeout = (promise, ms = 10000) => {
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('La operación tardó demasiado. Verifica tu conexión o permisos de Firestore.')), ms)
        );
        return Promise.race([promise, timeout]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nombre.trim()) return alert("El nombre es obligatorio");
        if (form.precioVenta <= 0) return alert("El precio debe ser mayor a 0");

        setSaving(true);  // ← solo afecta el botón, no la tabla
        try {
            if (modoEdicion) {
                await withTimeout(actualizarProducto(modoEdicion, form));
            } else {
                await withTimeout(crearProducto(form));
            }
            setForm({ nombre: '', precioVenta: 0, precioCompra: 0, stock: 0, categoria: '', unidad: 'unidad' });
            setModoEdicion(null);
            cargarProductos(); // sin await → la tabla se refresca en paralelo
        } catch (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        } finally {
            setSaving(false); // ← siempre libera el botón
        }
    };

    const handleEditar = (p) => {
        setModoEdicion(p.id);
        setForm(p);
    };

    const handleEliminar = async (id) => {
        if (confirm("¿Seguro que deseas eliminar este producto?")) {
            await eliminarProducto(id);
            cargarProductos();
        }
    };

    const handleCancelar = () => {
        setModoEdicion(null);
        setForm({ nombre: '', precioVenta: 0, precioCompra: 0, categoria: '', unidad: 'unidad' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow border border-pink-100 sticky top-24">
                    <h2 className="text-xl font-bold text-pink-700 mb-4">
                        {modoEdicion ? '✏️ Editar Producto' : '📦 Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                className="input-field mt-1"
                                placeholder="Ej: Vela Aromática"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio Venta</label>
                                <input
                                    type="number"
                                    value={form.precioVenta}
                                    onChange={e => setForm({ ...form, precioVenta: Number(e.target.value) })}
                                    className="input-field mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock (Cant.)</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                                    className="input-field mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                value={form.categoria}
                                onChange={e => setForm({ ...form, categoria: e.target.value })}
                                className="input-field mt-1"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Velas">Velas</option>
                                <option value="Jabones">Jabones</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Insumos">Insumos</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-xs">Costo (Opcional)</label>
                            <input
                                type="number"
                                value={form.precioCompra}
                                onChange={e => setForm({ ...form, precioCompra: Number(e.target.value) })}
                                className="input-field mt-1 text-sm bg-gray-50"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="submit" disabled={saving} className={`flex-1 btn-primary ${saving ? 'opacity-50' : ''}`}>
                                {saving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar')}
                            </button>
                            {modoEdicion && (
                                <button type="button" onClick={handleCancelar} className="btn-secondary">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Lista */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Inventario de Productos</h2>

                    {loading ? <p>Cargando...</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-200 text-sm">
                                        <th className="p-3">Nombre</th>
                                        <th className="p-3">Stock</th>
                                        <th className="p-3">Precio</th>
                                        <th className="p-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {productos.map(p => (
                                        <tr key={p.id} className="hover:bg-pink-50">
                                            <td className="p-3 font-medium">
                                                {p.nombre}
                                                <div className="text-xs text-gray-400">{p.categoria}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${(p.stock || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {p.stock || 0} u.
                                                </span>
                                            </td>
                                            <td className="p-3 font-bold text-pink-600">${Number(p.precioVenta).toLocaleString()}</td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => handleEditar(p)} className="text-blue-500 hover:text-blue-700">✏️</button>
                                                <button onClick={() => handleEliminar(p.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {productos.length === 0 && (
                                <p className="text-center text-gray-400 py-8">No hay productos registrados.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Productos;

import React, { useState, useEffect } from 'react';
import { obtenerGastos, guardarGasto, eliminarGasto } from '../services/gastos';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { formatCOP, formatDate } from '../utils/format';

const Gastos = () => {
    const { currentUser } = useAuth();
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        descripcion: '',
        monto: '',
        metodo: 'Efectivo',
        categoria: 'Insumos',
        proveedor: ''
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerGastos();
            setGastos(data);
        } catch (error) {
            console.error("Error cargando gastos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.descripcion || Number(form.monto) <= 0) return alert("Descripción y Monto son obligatorios");

        const nuevoGasto = {
            ...form,
            monto: Number(form.monto),
            usuario: currentUser.email
        };

        try {
            await guardarGasto(nuevoGasto);
            setForm({ descripcion: '', monto: '', metodo: 'Efectivo', categoria: 'Insumos', proveedor: '' });
            cargarDatos();
            alert("Gasto registrado");
        } catch (error) {
            alert("Error al guardar gasto");
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar este gasto?')) {
            await eliminarGasto(id);
            cargarDatos();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow border border-yellow-100 sticky top-24">
                    <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                        <span>💸</span> Registrar Gasto
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input
                                type="text"
                                value={form.descripcion}
                                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Pago de luz, Compra cera..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.monto}
                                    onChange={e => setForm({ ...form, monto: e.target.value })}
                                    className="input-field"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select
                                    value={form.categoria}
                                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="Insumos">Insumos</option>
                                    <option value="Servicios">Servicios</option>
                                    <option value="Nomina">Nómina</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                            <select
                                value={form.metodo}
                                onChange={e => setForm({ ...form, metodo: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Caja Menor">Caja Menor</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl shadow transition transform active:scale-95 flex justify-center gap-2"
                        >
                            <span>💾</span> Guardar Gasto
                        </button>
                    </form>
                </div>
            </div>

            {/* Historial */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Últimos Gastos</h2>

                    {loading ? (
                        <p className="text-center text-gray-500">Cargando...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-200 text-sm">
                                        <th className="p-3">Fecha</th>
                                        <th className="p-3">Descripción</th>
                                        <th className="p-3">Categoría</th>
                                        <th className="p-3">Monto</th>
                                        <th className="p-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {gastos.map((g) => (
                                        <motion.tr
                                            key={g.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-yellow-50 transition-colors"
                                        >
                                            <td className="p-3 text-sm text-gray-600">
                                                {formatDate(g.fecha)}
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">{g.descripcion}</td>
                                            <td className="p-3 text-sm text-gray-500">{g.categoria}</td>
                                            <td className="p-3 font-bold text-red-500">-{formatCOP(g.monto)}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(g.id)}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {gastos.length === 0 && (
                                <p className="text-center text-gray-400 py-8">No hay gastos registrados.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gastos;

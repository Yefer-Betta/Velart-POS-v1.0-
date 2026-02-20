import React, { useState, useEffect, useCallback } from 'react';
import { obtenerCierres, generarCierre } from '../services/cierres';
import { useAuth } from '../context/AuthContext';
import { formatCOP, formatDate } from '../utils/format';

const Cierres = () => {
    const { currentUser } = useAuth();
    const [cierres, setCierres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generando, setGenerando] = useState(false);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const data = await obtenerCierres();
            setCierres(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const handleGenerarCierre = async () => {
        if (!confirm('¿Generar cierre del día con las ventas y gastos actuales?')) return;
        setGenerando(true);
        try {
            await generarCierre(currentUser?.email || 'admin');
            await cargar();
            alert('✅ Cierre generado exitosamente');
        } catch (e) {
            console.error(e);
            alert('Error al generar cierre');
        } finally {
            setGenerando(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">🔒 Cierres del Día</h2>
                <button
                    onClick={handleGenerarCierre}
                    disabled={generando}
                    className={`px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow transition ${generando ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {generando ? '⏳ Generando...' : '➕ Generar Cierre ahora'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50">
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Usuario</th>
                            <th className="px-4 py-3">Ventas</th>
                            <th className="px-4 py-3">Gastos</th>
                            <th className="px-4 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400">Cargando cierres...</td></tr>
                        ) : cierres.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400">No hay cierres registrados aún.</td></tr>
                        ) : cierres.map(c => (
                            <tr key={c.id} className="hover:bg-pink-50 transition">
                                <td className="px-4 py-3 text-sm">{formatDate(c.fecha)}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{c.usuario}</td>
                                <td className="px-4 py-3 font-bold text-pink-600">{formatCOP(c.totalVentas)}</td>
                                <td className="px-4 py-3 font-bold text-yellow-600">{formatCOP(c.totalGastos)}</td>
                                <td className={`px-4 py-3 font-bold ${c.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCOP(c.balance)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cierres;

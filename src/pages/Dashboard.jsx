import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { obtenerResumenDashboard } from '../services/dashboard';
import { formatCOP } from '../utils/format';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalGastos: 0,
        balance: 0,
        productoMasVendido: { nombre: '-', cantidad: 0 },
        ventasHoy: 0,
        ultimaVenta: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerResumenDashboard();
                setStats(data);
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const cards = [
        { title: 'Ventas Totales', value: formatCOP(stats.totalVentas), color: 'text-pink-600', borderColor: 'border-pink-500', bgBtn: 'bg-pink-500', link: '/ventas' },
        { title: 'Gastos Totales', value: formatCOP(stats.totalGastos), color: 'text-yellow-600', borderColor: 'border-yellow-500', bgBtn: 'bg-yellow-500', link: '/gastos' },
        { title: 'Balance', value: formatCOP(stats.balance), color: stats.balance >= 0 ? 'text-green-600' : 'text-red-600', borderColor: stats.balance >= 0 ? 'border-green-500' : 'border-red-500', bgBtn: stats.balance >= 0 ? 'bg-green-500' : 'bg-red-500', link: '/cierres' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-pink-700">Panel de Control</h2>

            {/* Tarjetas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white p-6 rounded-xl shadow border-l-4 ${stat.borderColor}`}
                    >
                        <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                        {loading ? (
                            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-3"></div>
                        ) : (
                            <p className={`text-3xl font-bold mt-3 ${stat.color}`}>{stat.value}</p>
                        )}
                        <a href={stat.link} className={`mt-4 block text-center w-full text-white py-2 rounded-lg font-medium shadow transition hover:opacity-90 ${stat.bgBtn}`}>
                            Ver detalles
                        </a>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resumen Rapido */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Resumen Rápido</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">Ventas de Hoy</span>
                            <span className="font-semibold text-pink-600">
                                {loading ? '...' : formatCOP(stats.ventasHoy)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">Producto estrella 🌟</span>
                            <span className="font-semibold text-gray-800">
                                {loading ? '...' : `${stats.productoMasVendido.nombre} (${stats.productoMasVendido.cantidad})`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">Última actividad</span>
                            <span className="font-semibold text-gray-500 text-sm">
                                {loading ? '...' : (stats.ultimaVenta ? new Date(stats.ultimaVenta).toLocaleString() : 'Sin actividad')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Placeholder Grafica */}
                <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
                    <span className="text-4xl mb-2">📊</span>
                    <p>Gráfica de rendimiento (Próximamente)</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

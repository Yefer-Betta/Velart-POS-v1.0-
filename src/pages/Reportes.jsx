import React, { useState } from 'react';
import { exportarReporteExcel } from '../services/reportes';

const Reportes = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        const success = await exportarReporteExcel();
        if (success) {
            alert("Reporte descargado correctamente 📄");
        } else {
            alert("Error al descargar reporte ❌");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Reportes y Exportación</h2>
            <p className="text-gray-600 mb-8">
                Descarga un archivo Excel con todo el historial de ventas y gastos para tu contabilidad.
            </p>

            <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
            >
                {loading ? 'Generando...' : (
                    <>
                        <span className="text-2xl">📊</span>
                        Descargar Reporte en Excel
                    </>
                )}
            </button>
            <p className="mt-4 text-xs text-gray-400">El archivo incluirá hojas separadas para Ventas y Gastos.</p>
        </div>
    );
};

export default Reportes;

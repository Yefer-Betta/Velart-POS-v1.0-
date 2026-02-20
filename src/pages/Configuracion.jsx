import React, { useState, useEffect } from 'react';

const Configuracion = () => {
    const [config, setConfig] = useState({
        nombreEmpresa: '',
        nit: '',
        telefono: '',
        direccion: '',
        moneda: 'COP',
        tema: 'claro',
    });
    const [guardado, setGuardado] = useState(false);

    useEffect(() => {
        // Cargar configuración guardada en localStorage
        const saved = localStorage.getItem('velart_config');
        if (saved) setConfig(JSON.parse(saved));
    }, []);

    const guardar = () => {
        localStorage.setItem('velart_config', JSON.stringify(config));
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuración del Sistema</h2>

            <div className="bg-white rounded-xl shadow p-6 space-y-5">
                <h3 className="font-bold text-gray-700 text-lg border-b pb-2">Información de la Empresa</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                        <input type="text" value={config.nombreEmpresa}
                            onChange={e => setConfig({ ...config, nombreEmpresa: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                            placeholder="Velart" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIT / RUT</label>
                        <input type="text" value={config.nit}
                            onChange={e => setConfig({ ...config, nit: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                            placeholder="900.123.456-7" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="text" value={config.telefono}
                            onChange={e => setConfig({ ...config, telefono: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                            placeholder="+57 300 000 0000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input type="text" value={config.direccion}
                            onChange={e => setConfig({ ...config, direccion: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                            placeholder="Calle 123 # 45-67, Bogotá" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                <h3 className="font-bold text-gray-700 text-lg border-b pb-2">Preferencias</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                    <select value={config.moneda} onChange={e => setConfig({ ...config, moneda: e.target.value })}
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none">
                        <option value="COP">COP - Peso Colombiano</option>
                        <option value="USD">USD - Dólar</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">El sistema usa COP por defecto.</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={guardar}
                    className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow transition">
                    Guardar Cambios
                </button>
                {guardado && <span className="text-green-600 font-medium">✅ ¡Guardado!</span>}
            </div>
        </div>
    );
};

export default Configuracion;

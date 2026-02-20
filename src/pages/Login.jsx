import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#ffe3e3]">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm border border-pink-400">
                <div className="flex justify-center mb-4">
                    <img src="/img/logo_velartbgw.png" alt="Logo Velart" className="w-24 h-24 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Iniciar Sesión</h2>

                {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Usuario</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border-2 border-pink-400 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600"
                            placeholder="Ingrese su usuario (admin)"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Nota: Si es la primera vez, usa <b>admin</b> y <b>1234</b>.</p>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border-2 border-pink-400 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600"
                            placeholder="Ingrese su contraseña (1234)"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition transform active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

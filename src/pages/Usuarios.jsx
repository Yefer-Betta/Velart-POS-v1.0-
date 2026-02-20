import React, { useState, useEffect, useCallback } from 'react';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../services/usuarios';

const ROLES = ['admin', 'vendedor', 'bodeguero'];

const UsuariosRoles = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'vendedor' });
    const [error, setError] = useState('');

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.nombre.trim() || !form.email.trim() || !form.password) return setError('Todos los campos son obligatorios.');
        if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
        setSubmitting(true);
        try {
            await crearUsuario(form);
            setForm({ nombre: '', email: '', password: '', rol: 'vendedor' });
            setMostrarForm(false);
            await cargar();
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                setError('Este correo ya está registrado.');
            } else {
                setError(`Error: ${e.message}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const toggleActivo = async (u) => {
        await actualizarUsuario(u.id, { activo: !u.activo });
        cargar();
    };

    const handleEliminar = async (id) => {
        if (confirm('¿Eliminar usuario? Solo se borrará su perfil, no su acceso de Firebase Auth.')) {
            await eliminarUsuario(id);
            cargar();
        }
    };

    const rolColors = { admin: 'bg-pink-100 text-pink-700', vendedor: 'bg-blue-100 text-blue-700', bodeguero: 'bg-yellow-100 text-yellow-700' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">👥 Usuarios & Roles</h2>
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow transition"
                >
                    {mostrarForm ? '✖ Cancelar' : '➕ Nuevo Usuario'}
                </button>
            </div>

            {/* Formulario */}
            {mostrarForm && (
                <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
                    <h3 className="font-bold text-pink-700 mb-4">Crear Nuevo Usuario</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none" placeholder="Juan Pérez" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none" placeholder="juan@empresa.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none" placeholder="Mínimo 6 caracteres" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none">
                                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                            </select>
                        </div>
                        {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={submitting}
                            className={`col-span-2 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition ${submitting ? 'opacity-50' : ''}`}>
                            {submitting ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </form>
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Rol</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400">Cargando usuarios...</td></tr>
                        ) : usuarios.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400">No hay usuarios registrados aún.</td></tr>
                        ) : usuarios.map(u => (
                            <tr key={u.id} className="hover:bg-pink-50 transition">
                                <td className="px-4 py-3 font-medium">{u.nombre}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${rolColors[u.rol] || 'bg-gray-100 text-gray-600'}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleActivo(u)}
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {u.activo ? '● Activo' : '● Inactivo'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => handleEliminar(u.id)} className="text-red-400 hover:text-red-600 text-sm">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Descripción de Roles */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-bold text-yellow-800 mb-2">📋 Descripción de Roles</h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                    <li><b>Admin:</b> Acceso total: ventas, gastos, productos, reportes y usuarios.</li>
                    <li><b>Vendedor:</b> Solo puede registrar ventas y ver el dashboard.</li>
                    <li><b>Bodeguero:</b> Gestión del inventario y productos.</li>
                </ul>
            </div>
        </div>
    );
};

export default UsuariosRoles;

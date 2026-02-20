import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Ventas', path: '/ventas', icon: '🛒' },
    { name: 'Productos', path: '/productos', icon: '📦' },
    { name: 'Inventario', path: '/inventario', icon: '🗃️' },
    { name: 'Gastos', path: '/gastos', icon: '💸' },
    { name: 'Cierres', path: '/cierres', icon: '🔒' },
    { name: 'Reportes', path: '/reportes', icon: '📋' },
    { name: 'Usuarios', path: '/usuarios', icon: '👥' },
    { name: 'Configuración', path: '/configuracion', icon: '⚙️' },
];

// ── Contenido del menú (reutilizado en desktop y drawer mobile)
const NavLinks = ({ onClose }) => {
    const location = useLocation();
    return (
        <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium text-sm ${isActive ? 'bg-white/20 shadow' : 'hover:bg-white/10'}`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
};

// ── Sidebar desktop (visible en md+)
const Sidebar = () => (
    <aside className="w-60 bg-gradient-to-b from-pink-700 to-pink-600 text-white min-h-screen p-4 hidden md:flex flex-col flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
            <img src="/img/logo_velartbgw.png" alt="Velart" className="w-10 h-10 object-contain bg-white rounded-full p-1 flex-shrink-0" />
            <div>
                <h1 className="text-xl font-bold tracking-tight leading-none">Velart</h1>
                <p className="text-pink-200 text-xs">Sistema POS</p>
            </div>
        </div>
        <NavLinks onClose={() => { }} />
    </aside>
);

// ── Drawer mobile (slide-in desde la izquierda)
const MobileDrawer = ({ open, onClose }) => (
    <>
        {/* Overlay oscuro */}
        {open && (
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />
        )}
        {/* Panel deslizante */}
        <aside
            className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-pink-700 to-pink-600 text-white z-50 flex flex-col p-4 transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <img src="/img/logo_velartbgw.png" alt="Velart" className="w-10 h-10 object-contain bg-white rounded-full p-1 flex-shrink-0" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none">Velart</h1>
                        <p className="text-pink-200 text-xs">Sistema POS</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white text-2xl font-bold leading-none"
                    aria-label="Cerrar menú"
                >
                    ✕
                </button>
            </div>
            <NavLinks onClose={onClose} />
        </aside>
    </>
);

// ── Header
const Header = ({ onMenuToggle }) => {
    const { logout, currentUser } = useAuth();
    const { dark, toggleDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const currentPage = menuItems.find(m => m.path === location.pathname);

    return (
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Abrir menú"
                >
                    <span className="w-5 h-0.5 bg-gray-600 block" />
                    <span className="w-5 h-0.5 bg-gray-600 block" />
                    <span className="w-5 h-0.5 bg-gray-600 block" />
                </button>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {currentPage ? `${currentPage.icon} ${currentPage.name}` : 'Panel de Control'}
                </h2>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                {/* Toggle modo oscuro */}
                <button
                    onClick={toggleDark}
                    title={dark ? 'Modo claro' : 'Modo oscuro'}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition text-lg"
                >
                    {dark ? '☀️' : '🌙'}
                </button>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-700">{currentUser?.displayName || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                    <span className="sm:hidden">🚪</span>
                </button>
            </div>
        </header>
    );
};

// ── Layout principal
const Layout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar fijo en desktop */}
            <Sidebar />

            {/* Drawer deslizante en móvil */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header onMenuToggle={() => setDrawerOpen(prev => !prev)} />
                <main className="flex-1 overflow-y-auto p-3 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';

// Lazy-loaded pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Ventas = lazy(() => import('./pages/Ventas'));
const Gastos = lazy(() => import('./pages/Gastos'));
const Productos = lazy(() => import('./pages/Productos'));
const Inventario = lazy(() => import('./pages/Inventario'));
const Reportes = lazy(() => import('./pages/Reportes'));
const Cierres = lazy(() => import('./pages/Cierres'));
const Configuracion = lazy(() => import('./pages/Configuracion'));
const Usuarios = lazy(() => import('./pages/Usuarios'));

// Loading spinner for lazy routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-full py-20">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><PageLoader /></div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="ventas" element={<Suspense fallback={<PageLoader />}><Ventas /></Suspense>} />
              <Route path="productos" element={<Suspense fallback={<PageLoader />}><Productos /></Suspense>} />
              <Route path="gastos" element={<Suspense fallback={<PageLoader />}><Gastos /></Suspense>} />
              <Route path="inventario" element={<Suspense fallback={<PageLoader />}><Inventario /></Suspense>} />
              <Route path="reportes" element={<Suspense fallback={<PageLoader />}><Reportes /></Suspense>} />
              <Route path="cierres" element={<Suspense fallback={<PageLoader />}><Cierres /></Suspense>} />
              <Route path="configuracion" element={<Suspense fallback={<PageLoader />}><Configuracion /></Suspense>} />
              <Route path="usuarios" element={<Suspense fallback={<PageLoader />}><Usuarios /></Suspense>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


import { obtenerVentas } from './ventas';
import { obtenerGastos } from './gastos';

export const obtenerResumenDashboard = async () => {
    // Nota: En una app mas grande, esto deberia hacerse en el backend (Cloud Functions)
    // para no descargar todas las ventas. Para este MVP, lo hacemos aqui.

    const [ventas, gastos] = await Promise.all([
        obtenerVentas(1000), // Aumentamos el límite para asegurar un cálculo correcto en el MVP
        obtenerGastos()
    ]);

    const totalVentas = ventas.reduce((acc, curr) => acc + Number(curr.total), 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + Number(curr.monto), 0);
    const balance = totalVentas - totalGastos;

    // Calcular producto mas vendido
    const conteoProductos = {};
    ventas.forEach(v => {
        const nombre = v.producto;
        conteoProductos[nombre] = (conteoProductos[nombre] || 0) + Number(v.cantidad);
    });

    let productoMasVendido = { nombre: 'N/A', cantidad: 0 };
    Object.entries(conteoProductos).forEach(([nombre, cantidad]) => {
        if (cantidad > productoMasVendido.cantidad) {
            productoMasVendido = { nombre, cantidad };
        }
    });

    // Calcular ventas de hoy
    const hoy = new Date().toLocaleDateString();
    const ventasHoy = ventas
        .filter(v => new Date(v.fecha).toLocaleDateString() === hoy)
        .reduce((acc, v) => acc + Number(v.total), 0);

    return {
        totalVentas,
        totalGastos,
        balance,
        productoMasVendido,
        ventasHoy,
        ultimaVenta: ventas[0]?.fecha // Asumiendo que vienen ordenadas por fecha desc
    };
};

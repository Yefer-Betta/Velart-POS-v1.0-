import * as XLSX from 'xlsx';
import { obtenerVentas } from './ventas';
import { obtenerGastos } from './gastos';

export const exportarReporteExcel = async () => {
    try {
        const [ventas, gastos] = await Promise.all([
            obtenerVentas(),
            obtenerGastos()
        ]);

        const wb = XLSX.utils.book_new();

        // Hoja de Ventas
        const ventasData = ventas.map(v => ({
            Fecha: new Date(v.fecha).toLocaleString(),
            Producto: v.producto,
            Cantidad: v.cantidad,
            Precio: v.precio,
            Total: v.total,
            Metodo: v.metodoPago,
            ID: v.id
        }));
        const wsVentas = XLSX.utils.json_to_sheet(ventasData);
        XLSX.utils.book_append_sheet(wb, wsVentas, "Ventas");

        // Hoja de Gastos
        const gastosData = gastos.map(g => ({
            Fecha: new Date(g.fecha).toLocaleString(),
            Descripcion: g.descripcion,
            Categoria: g.categoria,
            Monto: g.monto,
            Metodo: g.metodo,
            ID: g.id
        }));
        const wsGastos = XLSX.utils.json_to_sheet(gastosData);
        XLSX.utils.book_append_sheet(wb, wsGastos, "Gastos");

        // Guardar Archivo
        XLSX.writeFile(wb, `Reporte_Velart_${new Date().toISOString().slice(0, 10)}.xlsx`);
        return true;
    } catch (error) {
        console.error("Error exportando excel:", error);
        return false;
    }
};

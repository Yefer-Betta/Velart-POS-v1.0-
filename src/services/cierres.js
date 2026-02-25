import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, writeBatch } from 'firebase/firestore';
import { obtenerTodasLasVentas } from './ventas';
import { obtenerTodosLosGastos } from './gastos';

const COLLECTION_NAME = 'cierres';

export const obtenerCierres = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const generarCierre = async (usuario) => {
    // 1. Obtener TODOS los datos (sin límites de paginación)
    const [ventas, gastos] = await Promise.all([obtenerTodasLasVentas(), obtenerTodosLosGastos()]);

    if (ventas.length === 0 && gastos.length === 0) throw new Error("No hay movimientos para cerrar.");

    const totalVentas = ventas.reduce((s, v) => s + (Number(v.total) || 0), 0);
    const totalGastos = gastos.reduce((s, g) => s + (Number(g.monto) || 0), 0);
    const balance = totalVentas - totalGastos;

    const cierre = {
        fecha: new Date().toISOString(),
        usuario,
        totalVentas,
        totalGastos,
        balance,
        cantidadVentas: ventas.length,
        cantidadGastos: gastos.length,
        // Guardamos un backup simplificado de los items en el cierre por si se necesita consultar
        detallesVentas: ventas.map(v => ({ prod: v.producto, cant: v.cantidad, total: v.total, pago: v.pago })),
        detallesGastos: gastos.map(g => ({ desc: g.descripcion, monto: g.monto }))
    };

    // 3. Iniciar transacción por lotes (Batch)
    const batch = writeBatch(db);

    // A. Crear el documento de cierre
    const cierreRef = await addDoc(collection(db, COLLECTION_NAME), cierre);

    // B. Borrar ventas procesadas
    ventas.forEach(venta => {
        batch.delete(venta.ref);
    });

    // C. Borrar gastos procesados
    gastos.forEach(gasto => {
        batch.delete(gasto.ref);
    });

    // 4. Ejecutar cambios (Atomic commit)
    await batch.commit();

    return cierre;
};

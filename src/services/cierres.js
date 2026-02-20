import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { obtenerVentas } from './ventas';
import { obtenerGastos } from './gastos';

const COLLECTION_NAME = 'cierres';

export const obtenerCierres = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const generarCierre = async (usuario) => {
    const [ventas, gastos] = await Promise.all([obtenerVentas(), obtenerGastos()]);

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
    };

    await addDoc(collection(db, COLLECTION_NAME), cierre);
    return cierre;
};

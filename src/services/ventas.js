import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'ventas';

export const guardarVenta = async (venta) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...venta,
            fecha: new Date().toISOString(), // Guardamos string ISO para compatibilidad visual fácil
            timestamp: Timestamp.now() // Guardamos Timestamp para ordenamiento eficiente
        });
        return { id: docRef.id, ...venta };
    } catch (e) {
        console.error("Error guardando venta: ", e);
        throw e;
    }
};

export const obtenerVentas = async () => {
    // Por defecto traemos las ultimas 50 para no saturar
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const eliminarVenta = async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

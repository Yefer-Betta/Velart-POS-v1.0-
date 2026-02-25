import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp, startAfter, limit } from 'firebase/firestore';

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

export const obtenerVentas = async (cantidad = 50, lastVisible = null) => {
    // Implementamos paginación con Firestore usando limit() y startAfter()
    let q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(cantidad));
    if (lastVisible) {
        q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(cantidad));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const eliminarVenta = async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

// Función auxiliar para el cierre de caja (sin paginación)
export const obtenerTodasLasVentas = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), ref: doc.ref }));
};

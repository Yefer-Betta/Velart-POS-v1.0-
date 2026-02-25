import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'gastos';

export const guardarGasto = async (gasto) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...gasto,
            fecha: new Date().toISOString(),
            timestamp: Timestamp.now()
        });
        return { id: docRef.id, ...gasto };
    } catch (e) {
        console.error("Error guardando gasto: ", e);
        throw e;
    }
};

export const obtenerGastos = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const obtenerTodosLosGastos = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), ref: doc.ref }));
};

export const eliminarGasto = async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

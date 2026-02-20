import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'productos';

export const obtenerProductos = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('nombre'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const crearProducto = async (producto) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...producto,
            fechaCreacion: new Date().toISOString()
        });
        return { id: docRef.id, ...producto };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const actualizarProducto = async (id, campos) => {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, campos);
};

export const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

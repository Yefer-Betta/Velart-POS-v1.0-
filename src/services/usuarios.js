import { db, auth } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const COLLECTION_NAME = 'usuarios';

export const obtenerUsuarios = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('nombre'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const crearUsuario = async ({ nombre, email, password, rol }) => {
    // Create in Firebase Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Save profile in Firestore
    await addDoc(collection(db, COLLECTION_NAME), {
        uid: user.uid,
        nombre,
        email,
        rol,
        activo: true,
        fechaCreacion: new Date().toISOString()
    });
    return user;
};

export const actualizarUsuario = async (id, campos) => {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, campos);
};

export const eliminarUsuario = async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

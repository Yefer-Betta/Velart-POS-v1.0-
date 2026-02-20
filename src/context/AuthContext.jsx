import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Funciones de autenticación con Firebase Real
    // Funciones de autenticación con Firebase Real
    const login = async (email, password) => {
        // Mapeo de credenciales simples a correos reales
        let finalEmail = email;
        let finalPassword = password;

        if (email === 'admin') {
            finalEmail = 'admin@velart.com';
            if (password === '1234') {
                finalPassword = '123456'; // Firebase pide min 6 caracteres
            }
        }

        try {
            return await signInWithEmailAndPassword(auth, finalEmail, finalPassword);
        } catch (error) {
            console.error("Firebase Login Error:", error.code, error.message);

            // Si el usuario no existe y es el admin por defecto, intentamos crearlo
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                // Solo si es nuestro admin por defecto y la contraseña mapeada es correcta
                if (finalEmail === 'admin@velart.com' && finalPassword === '123456') {
                    // Auto-registro inicial
                    try {
                        // Importamos dinamicamente para asegurar que auth está listo
                        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
                        console.log("Creando usuario administrador inicial...");

                        const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, finalPassword);
                        await updateProfile(userCredential.user, { displayName: "Administrador" });
                        return userCredential.user;
                    } catch (createError) {
                        console.error("Error creando admin:", createError);
                        throw createError;
                    }
                }
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('mockUser');
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para indicar cuándo está cargando el estado de autenticación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Finaliza el estado de carga
    });
    return () => unsubscribe();
  }, []);

  // Función para obtener el ID token actual del usuario
  const getToken = async () => {
    if (!user) return null;
    try {
      return await user.getIdToken(true); // Fuerza la renovación del token si es necesario
    } catch (error) {
      console.error("Error al obtener el token:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

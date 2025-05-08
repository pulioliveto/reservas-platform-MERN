import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configura la persistencia de sesión solo para la pestaña
    setPersistence(auth, browserSessionPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cierre de sesión tras 5 minutos de inactividad
    let timeout;
    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut(auth);
        setUser(null);
      }, INACTIVITY_LIMIT);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      unsubscribe();
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Llamada al backend para registrar el usuario en MongoDB
      const token = await user.getIdToken();
      await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      // Lógica para Google Calendar
      const accessToken = result.credential ? result.credential.accessToken : null;

      if (accessToken) {
        const response = await fetch('/api/google-calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        const data = await response.json();
        console.log('Google Calendar Data:', data);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const getToken = async () => {
    if (!user) return null;
    try {
      return await user.getIdToken(true);
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
    <AuthContext.Provider value={{ user, setUser, logout, getToken, loading, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

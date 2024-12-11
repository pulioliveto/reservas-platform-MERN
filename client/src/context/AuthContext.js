import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const provider = new GoogleAuthProvider();

  provider.addScope('https://www.googleapis.com/auth/calendar');
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const accessToken = result.credential.accessToken;

      // Envía el accessToken al servidor
      const response = await fetch('/api/google-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      const data = await response.json();
      console.log('Google Calendar Data:', data);

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

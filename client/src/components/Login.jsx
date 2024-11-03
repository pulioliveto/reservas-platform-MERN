import React from 'react';
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();  // Obtener el token JWT del usuario
      const user = result.user;
      console.log('Usuario autenticado:', user);
      console.log('ID Token:', idToken);  // Verifica que el token esté correctamente generado

      // Enviar el token al backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,  // Aquí va el token en el header
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
      window.location.href = '/';
      console.log('Respuesta del backend: ', data);
  
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };
  

  return (
    <div className="container text-center mt-5">
      <button onClick={handleLogin} className="btn btn-primary mt-3">
        Acceder con Google
      </button>
    </div>
  );
};
export default Login;
import React,  { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {

const { setUser } = useContext(AuthContext);

const handleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user); // Guardar el usuario en el contexto
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};

return (
  <div className="container mt-5">
    <h2>Iniciar sesión</h2>
    <button className="btn btn-primary" onClick={handleLogin}>
      Acceder con Google
    </button>
  </div>
);
};

export default Login;
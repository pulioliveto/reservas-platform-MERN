import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase proporcionada por ti
const firebaseConfig = {
  apiKey: "AIzaSyDxziuyVmIBosWGk58EO42YxfZ6l8xaHCM",
  authDomain: "gestion-de-reservas-f1a7a.firebaseapp.com",
  projectId: "gestion-de-reservas-f1a7a",
  storageBucket: "gestion-de-reservas-f1a7a.appspot.com",
  messagingSenderId: "749364858503",
  appId: "1:749364858503:web:72db374d9fac2a4bc9b222",
  measurementId: "G-Y4P9Q9HHB3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
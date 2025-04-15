import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './components/MainPage.jsx'
import Login from './components/Login.jsx';
import Navbar from './components/NavBar.jsx'
import TuPerfil from './components/TuPerfil.jsx';
import CrearNegocio from './components/CrearNegocio.jsx';
import BuscarNegocio from './components/BuscarNegocio.jsx';
import { AuthProvider } from "./context/AuthContext";
import EditarNegocio from './components/EditarNegocio.jsx';
import DetalleNegocio from './components/DetalleNegocio.jsx';
import MisTurnos from './components/MisTurnos.jsx';




function App() {
  return (
    <AuthProvider>
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/crear-negocio" element={<CrearNegocio />} />
        <Route path="/reservar-turno" element={<BuscarNegocio />} />
        <Route path="/tu-perfil" element={<TuPerfil />} />
        <Route path="/editar-negocio/:id" element={<EditarNegocio />} />
        <Route path="/negocio/:id" element={<DetalleNegocio />} />
        <Route path="/mis-turnos" element={<MisTurnos />} />
    </Routes>
    <ToastContainer />
  </Router>
  </AuthProvider>
  );
}

export default App;

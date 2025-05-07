import React, { useContext } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Navbar from './components/NavBar.jsx';
import TuPerfil from './pages/TuPerfil';
import CrearNegocio from './pages/CrearNegocio';
import BuscarNegocio from './pages/BuscarNegocio';
import { AuthContext } from "./context/AuthContext";
import DetalleNegocio from './pages/DetalleNegocio';
import MisTurnos from './pages/MisTurnos';
import ComoFunciona from './pages/ComoFunciona.jsx';
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div className="spinner-border text-primary" style={{ width: 60, height: 60 }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/crear-negocio" element={<CrearNegocio />} />
        <Route path="/reservar-turno" element={<BuscarNegocio />} />
        <Route path="/tu-perfil" element={<TuPerfil />} />
        <Route path="/negocio/:id" element={<DetalleNegocio />} />
        <Route path="/mis-turnos" element={<MisTurnos />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

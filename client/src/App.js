import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage.jsx'
import Login from './components/Login.jsx';
import Navbar from './components/NavBar.jsx'
import TuPerfil from './components/TuPerfil.jsx';
import CrearNegocio from './components/CrearNegocio.jsx';
import BuscarNegocio from './components/BuscarNegocio.jsx';
import { AuthProvider } from "./context/AuthContext";


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
    </Routes>
  </Router>
  </AuthProvider>
  );
}

export default App;

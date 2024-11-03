import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage.jsx'
import Login from './components/Login.jsx';
import CrearNegocio from './components/CrearNegocio.jsx';
import BuscarNegocio from './components/BuscarNegocio.jsx';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/crear-negocio" element={<CrearNegocio />} />
        <Route path="/reservar-turno" element={<BuscarNegocio />} />
    </Routes>
  </Router>
  );
}

export default App;

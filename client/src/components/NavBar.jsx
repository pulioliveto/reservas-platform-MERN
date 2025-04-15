import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../img/logo.png';
import '../css/MainPage.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/'); // Redirige al home si el usuario no está autenticado y no está en la página de login
    }
  }, [user, navigate, location.pathname]); // Ejecuta el efecto cuando cambia el estado del usuario o la ubicación

  const handleLogoToHome = () => {
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <img src={logo} alt="logo de la web" onClick={handleLogoToHome} style={{ height: '100px', margin: "0px", padding: "0px", cursor: "pointer" }} />
        <div className="ml-auto">
          {user ? (
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <img
                  src={user.photoURL}
                  alt="Foto de perfil"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", marginRight: "10px", cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <span
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.displayName} <i className="bi bi-caret-down-fill"></i>
                </span>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/crear-negocio')}>
                      <i className="bi bi-plus-circle"></i> Crear negocio
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/tu-perfil')}>
                      <i className="bi bi-briefcase"></i> Mis negocios
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/mis-turnos')}>
                      <i className="bi bi-calendar-check"></i> Mis turnos
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i> Desconectarse
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/tu-perfil'); // Redirige al perfil si el usuario está autenticado
    } else {
      navigate('/'); // Opcional: redirige al home si no está autenticado
    }
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="/">Reservá tu Turno</a>
      <div className="ml-auto">
        {user ? (
          <div className="d-flex align-items-center">
            <img
              src={user.photoURL}
              alt="Foto de perfil"
              className="rounded-circle"
              onClick={handleLogoClick}
              style={{ width: "40px", height: "40px", marginRight: "10px", cursor:"pointer" }}
            />
            <button className="btn btn-danger" onClick={logout}>
              Desconectarse
            </button>
          </div>
        ) : (
          <a className="btn btn-primary" href="/login">
            Iniciar sesión
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
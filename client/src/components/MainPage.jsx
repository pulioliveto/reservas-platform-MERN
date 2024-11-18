import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeedLoginAlert from './NeedLoginAlert';
import { useAuth } from '../hooks/useAuth'
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const handleCreateBusiness = () => {
    if (!isAuthenticated) {
      // No hacemos nada más aquí porque el componente `NeedLoginAlert` se encargará de la redirección
      return;
    }
    // Si está autenticado, redirigimos a la página de creación de negocio
    navigate('/crear-negocio');
  };


  };
  return (
    <div className="container text-center my-5">
      
      <h1 className="mt-5">Bienvenido a la Plataforma de Gestión de Reservas</h1>
      <p className="lead">Seleccione una de las opciones para comenzar</p>
      
      <div className="d-flex justify-content-center mt-4">
        <Link onClick={handleCreateBusiness} to="/crear-negocio" className="btn btn-primary mx-2">
          Tengo un negocio
        </Link>
          {/* Mostrar la alerta si no está autenticado */}
      {!isAuthenticated && <NeedLoginAlert />}
        <Link to="/reservar-turno" className="btn btn-secondary mx-2">
          Quiero reservar un turno
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
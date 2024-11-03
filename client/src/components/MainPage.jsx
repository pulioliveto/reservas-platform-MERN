import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  return (
    <div className="container text-center my-5">
      <header className="d-flex justify-content-end">
        <Link to="/login" className="btn btn-outline-primary">
          Iniciar Sesión
        </Link>
      </header>
      
      <h1 className="mt-5">Bienvenido a la Plataforma de Gestión de Reservas</h1>
      <p className="lead">Seleccione una de las opciones para comenzar</p>
      
      <div className="d-flex justify-content-center mt-4">
        <Link to="/crear-negocio" className="btn btn-primary mx-2">
          Tengo un negocio
        </Link>
        <Link to="/reservar-turno" className="btn btn-secondary mx-2">
          Quiero reservar un turno
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
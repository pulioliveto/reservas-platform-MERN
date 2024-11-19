import React from 'react';
import { useNavigate } from 'react-router-dom';

const NeedLoginAlert = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="alert alert-warning" role="alert">
      <strong>¡Atención!</strong> Para crear un negocio, necesitas iniciar sesión.
      <button className="btn btn-link" onClick={redirectToLogin}>Iniciar sesión</button>
    </div>
  );
};

export default NeedLoginAlert;


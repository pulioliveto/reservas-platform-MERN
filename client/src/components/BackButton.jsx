import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-3">
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)} // Navega a la página anterior
      >
        Volver
      </button>
    </div>
  );
};

export default BackButton;

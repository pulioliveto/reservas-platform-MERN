import React from 'react';
import { toast } from 'react-toastify';

const SomeComponent = () => {
  const showAlert = () => {
    toast.success('¡Operación exitosa!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000, // Tiempo en milisegundos antes de que la alerta se cierre automáticamente
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div>
      <button onClick={showAlert}>Mostrar Alerta</button>
    </div>
  );
};

export default SomeComponent; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBusinesses, deleteBusiness } from '../services/apiBusiness';
import { getAuth } from 'firebase/auth'; // Importa Firebase Auth

const TuPerfil = () => {
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null); // Para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken(true); // Obtén el token del usuario actual
        const response = await getUserBusinesses(token); // Pasa el token al servicio
        setBusinesses(response);
      } catch (error) {
        console.error('Error al obtener los negocios:', error);
        setError(error.message); // Guarda el mensaje de error
      }
    };

    fetchBusinesses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este negocio?')) {
      return; // Confirma antes de eliminar
    }

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true); // Obtén el token de autenticación
      await deleteBusiness(id, token); // Llama a la API para eliminar el negocio
      setBusinesses((prevBusinesses) => prevBusinesses.filter((b) => b._id !== id)); // Actualiza el estado
    } catch (error) {
      console.error('Error al eliminar el negocio:', error);
      setError('No se pudo eliminar el negocio. Intenta nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Tu Perfil</h2>
      {error && <div className="alert alert-danger">Error: {error}</div>} {/* Muestra errores */}
      <div>
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <div key={business._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{business.name}</h5>
                <p className="card-text">{business.description}</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/editar-negocio/${business._id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(business._id)} // Llama al manejador de eliminar
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes negocios creados aún.</p>
        )}
      </div>
    </div>
  );
};

export default TuPerfil;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBusinesses } from '../services/apiBusiness';

const TuPerfil = () => {
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await getUserBusinesses();
        setBusinesses(response);
      } catch (error) {
        console.error('Error al obtener los negocios:', error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Tu Perfil</h2>
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
                  onClick={() => {
                    // Lógica para eliminar negocio
                  }}
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

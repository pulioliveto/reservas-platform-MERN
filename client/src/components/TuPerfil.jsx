import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBusinesses, deleteBusiness } from '../services/apiBusiness';
import { getAuth } from 'firebase/auth';
import BackButton from './BackButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const TuPerfil = () => {
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken(true);
        const response = await getUserBusinesses(token);
        setBusinesses(response);
      } catch (error) {
        console.error('Error al obtener los negocios:', error);
        toast.error('Error al obtener los negocios: ' + error.message);
      }
    };

    fetchBusinesses();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken(true);
        await deleteBusiness(id, token);
        setBusinesses((prevBusinesses) => prevBusinesses.filter((b) => b._id !== id));
        toast.success('Negocio eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el negocio:', error);
        toast.error('No se pudo eliminar el negocio. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>Tu Perfil</h2>
      <div>
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <div key={business._id} className="card mb-3">
              <div
                className="card-body d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/negocio/${business._id}`)}
              >
                <div>
                  <h5 className="card-title">{business.name}</h5>
                  <p className="card-text">{business.description}</p>
                </div>
                <i className="bi bi-arrow-right"></i>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/editar-negocio/${business._id}`);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(business._id);
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

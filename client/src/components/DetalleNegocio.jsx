import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessById } from '../services/apiBusiness';
import BackButton from './BackButton';


const DetalleNegocio = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getBusinessById(id);
        setBusiness(data);
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
      }
    };

    fetchBusiness();
  }, [id]);

  if (!business) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>{business.name}</h2>
      <p>{business.description}</p>
      <p>{business.address}</p>
      <p>{business.phone}</p>
      <p>{business.email}</p>
      <p>{business.website}</p>
      {business.logo && (
        <img
          src={`http://localhost:5000/uploads/${business.logo.replace("\\", "/")}`}
          alt={`${business.name} logo`}
          style={{ width: '100px', height: '100px' }}
        />
      )}
    </div>
  );
};

export default DetalleNegocio;

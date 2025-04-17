import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const BuscarNegocio = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Función para manejar la búsqueda
  const searchBusinesses = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/businesses/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error al buscar negocios:', error);
    }
  };

  // useEffect para manejar la búsqueda en tiempo real
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchBusinesses(query);
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectBusiness = (id) => {
    navigate(`/negocio/${id}`);
  };

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>Buscar Negocio</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar negocios..."
        className="form-control"
      />
      <ul className="list-group mt-3">
        {results.map((business) => (
          <li
            key={business._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelectBusiness(business._id)}
          >
            <div className="d-flex align-items-center">
              {business.logo && (
                <img
                  src={`http://localhost:5000/uploads/${business.logo.replace("\\", "/")}`}
                  alt={`${business.name} logo`}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
              )}
              <div>
                <h5 className="mb-1">{business.name}</h5>
                <p className="mb-0 text-muted">{business.description}</p>
              </div>
            </div>
            <i className="bi bi-arrow-right"></i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscarNegocio;

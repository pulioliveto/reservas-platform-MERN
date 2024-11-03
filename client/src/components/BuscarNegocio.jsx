import React, { useState } from 'react';
import { fetchBusiness } from '../services/apiBusiness'; // Ajusta la ruta según tu estructura de archivos

const BuscarNegocio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/businesses?name=${searchTerm}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Error al buscar el negocio');
      }

      const data = await response.json();
      setResults(data); // Asume que el backend devuelve una lista de negocios que coinciden
    } catch (err) {
      setError('No se encontró ningún negocio con ese nombre');
      setResults([]);
    }
  };

  return (
    <div className="container">
      <h2>Buscar Negocio</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Ingrese el nombre del negocio"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-3">Buscar</button>
      </form>

      {error && <p className="text-danger">{error}</p>}

      <div>
        {results.length > 0 ? (
          results.map((business) => (
            <div key={business._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{business.name}</h5>
                <p className="card-text">Dirección: {business.address}</p>
                {/* Puedes incluir más detalles si están en el modelo */}
              </div>
            </div>
          ))
        ) : (
          !error && <p>No hay resultados para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default BuscarNegocio;


// searchTerm: Guarda el término ingresado por el usuario para buscar negocios.
// fetch: La solicitud se hace al endpoint de búsqueda en el backend (/api/businesses) pasando name como parámetro de consulta.
// Resultados: Los resultados se renderizan en una lista de tarjetas.
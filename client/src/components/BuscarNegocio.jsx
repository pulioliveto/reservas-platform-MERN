import React, { useState } from 'react';

const BuscarNegocio = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {

    if (!query.trim()) {
      alert("Por favor ingresa un término de búsqueda");
      return;
    }
    
    console.log("Ejecutando búsqueda..."); // Verificar que se ejecute
    try {
      const response = await fetch(`http://localhost:5000/api/businesses/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      console.log("Datos recibidos:", data); 
      setResults(data);
    } catch (error) {
      console.error('Error al buscar negocios:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Buscar Negocio</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar negocios..."
        className="form-control"
      />
      <button onClick={handleSearch} className="btn btn-primary mt-3">Buscar</button>
      <ul className="list-group mt-3">
        {results.map((business) => (
          <li key={business._id} className="list-group-item">
            {business.name} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscarNegocio;
  
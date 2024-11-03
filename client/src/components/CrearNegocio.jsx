import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../services/apiBusiness';

const CrearNegocio = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      address: '',
      phone: '',
      logo: null,
    });
    const [message, setMessage] = useState('');
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createBusiness(formData);
        setMessage('Negocio creado correctamente');
        setFormData({ name: '', type: '', address: '', phone: '', logo: null });
      } catch (error) {
        console.error('Error al crear el negocio:', error);
        setMessage('Error al crear el negocio');
      }
    };
  
    return (
      <div className="container mt-5">
        <h2>Crear Negocio</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Correo Electronico</label>
            <input
              type="email"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Contacto</label>
            <input
              type="number"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="logo" className="form-label">Logo (opcional)</label>
            <input
              type="file"
              className="form-control"
              id="logo"
              name="logo"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Crear Negocio</button>
        </form>
      </div>
    );
  };
  

export default CrearNegocio;


// Explicación de la Lógica:
//Estado (useState): Se define formData para almacenar cada campo del formulario, incluyendo el logo.

//Manejo de Archivos (handleFileChange): Se utiliza para capturar el archivo subido y guardarlo en el estado.

//Envío de Formulario (handleSubmit): Al enviar el formulario, se crea un objeto FormData que contiene los datos para enviar al backend, incluyendo el archivo de logo.

//Estilos con Bootstrap: La estructura utiliza clases de Bootstrap para mejorar el diseño y la disposición del formulario.

// Con este componente CrearNegocio, el usuario podrá añadir todos los datos necesarios, y opcionalmente, un logo.
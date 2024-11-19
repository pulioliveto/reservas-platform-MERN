import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../services/apiBusiness';
import { AuthContext } from "../context/AuthContext";
import NeedLoginAlert from "../components/NeedLoginAlert";


const CrearNegocio = () => {
    // Declarar todos los hooks al nivel superior
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      logo: null,
    });
    const [message, setMessage] = useState('');
  
    // Si el usuario no está logueado, renderizar el componente de alerta
    if (!user) {
      return <NeedLoginAlert />;
    }
  
    // Función para manejar cambios en los inputs del formulario
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    };
  
    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validar campos obligatorios
      if (!formData.name || !formData.address || !formData.phone || !formData.email) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
  
      // Construir FormData para enviar al backend
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
  
      // Loguear los datos enviados
      console.log('Datos enviados al backend:', Array.from(data.entries()));
  
      try {
        await createBusiness(data); // Asegúrate de enviar `data` como FormData
        setMessage('Negocio creado correctamente');
        setFormData({
          name: '',
          description: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          logo: null,
        });
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
          <label htmlFor="description" className="form-label">Tipo de Negocio</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="website" className="form-label">Sitio Web (opcional)</label>
          <input
            type="text"
            className="form-control"
            id="website"
            name="website"
            value={formData.website}
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
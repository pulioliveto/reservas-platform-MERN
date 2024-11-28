import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../services/apiBusiness';
import { AuthContext } from "../context/AuthContext";
import NeedLoginAlert from "../components/NeedLoginAlert";
import { getAuth } from 'firebase/auth';
import BackButton from '../components/BackButton';

const CrearNegocio = () => {
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

  if (!user) {
    return <NeedLoginAlert />;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken(true);
    console.log("Nuevo token generado:", token);

    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    console.log('Datos enviados al backend:', Array.from(data.entries()));

    try {
      await createBusiness(formData, token);
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
      <BackButton />
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
            placeholder="Mi Tienda"
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
            placeholder="Tienda de ropa"
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
            placeholder="Calle Falsa 123"
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
            placeholder="+34 123 456 789"
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
            placeholder="contacto@mitienda.com"
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
            placeholder="www.mitienda.com"
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
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateBusiness, getBusinessById } from '../services/apiBusiness';
import BackButton from '../components/BackButton';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EditarNegocio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: null,
  });
  const [currentLogo, setCurrentLogo] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBusiness = async () => {
      try {
        const business = await getBusinessById(id);
        setFormData({
          name: business.name,
          description: business.description,
          address: business.address,
          phone: business.phone,
          email: business.email,
          website: business.website,
          logo: null,
        });
        setCurrentLogo(business.logo);
      } catch (error) {
        console.error('Error al cargar el negocio:', error);
      }
    };

    fetchBusiness();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "website" && value && !value.startsWith("http")) {
      setFormData({ ...formData, [name]: `https://${value}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    if (!token) {
      toast.error('No estás autenticado');
      return;
    }

    try {
      await updateBusiness(id, formData, token);
      toast.success('Negocio actualizado correctamente');
      navigate('/tu-perfil');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      toast.error('Hubo un problema al actualizar el negocio.');
    }
  };

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>Editar Negocio</h2>
      <form onSubmit={handleSubmit} noValidate>
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
          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
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
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
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
          <label htmlFor="website" className="form-label">Sitio Web</label>
          <input
            type="url"
            className="form-control"
            id="website"
            placeholder="https://www.tusitio.com"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">Logo (Opcional)</label>
          {currentLogo && (
            <div className="mb-2">
              <img
                src={`http://localhost:5000/uploads/${currentLogo.replace("\\", "/")}`}
                alt="Logo actual"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            id="logo"
            name="logo"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        <button
          type="button"
          className="btn btn-secondary ms-3"
          onClick={() => navigate('/tu-perfil')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditarNegocio;


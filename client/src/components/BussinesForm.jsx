import React, { useState } from 'react';

function BusinessForm() {
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    contact: '',
    location: '',
    logo: null, // Para manejar el archivo del logo
  });

  // Maneja los cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({ ...businessData, [name]: value });
  };

  // Maneja la carga del logo
  const handleLogoChange = (e) => {
    setBusinessData({ ...businessData, logo: e.target.files[0] });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Agregar datos al FormData
    for (const key in businessData) {
      formData.append(key, businessData[key]);
    }

    // Aquí iría la lógica para enviar el formulario al backend
    // await yourCreateBusinessService(formData);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Crea tu Negocio</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Nombre de la Empresa <span className="text-danger">*</span></label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={businessData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={businessData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group mb-3">
          <label>Contacto</label>
          <input
            type="text"
            name="contact"
            className="form-control"
            value={businessData.contact}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Ubicación</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={businessData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-4">
          <label>Logo de la Empresa (opcional)</label>
          <input
            type="file"
            name="logo"
            className="form-control"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear Negocio
        </button>
      </form>
    </div>
  );
}

export default BusinessForm;
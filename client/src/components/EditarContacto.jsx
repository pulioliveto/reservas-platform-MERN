import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PhoneInputWhatsApp from './PhoneInputWhatsApp';
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';

const EditarContacto = ({ business, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    phone: business.phone ?? '',
    facebook: business.facebook ?? '',
    instagram: business.instagram ?? '',
    youtube: business.youtube ?? '',
    website: business.website ?? '',
    address: business.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (phone) => {
    setFormData(prev => ({ ...prev, phone }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group className="mb-3">
        <Form.Label>Dirección</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <PhoneInputWhatsApp value={formData.phone} onChange={handlePhoneChange} />
      </Form.Group>
      <Form.Group className="mb-3 d-flex align-items-center gap-2">
        <span><FaFacebook size={22} className="text-primary" /></span>
        <Form.Control
          type="url"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          placeholder="Link a Facebook (opcional)"
          autoComplete="off"
        />
      </Form.Group>
      <Form.Group className="mb-3 d-flex align-items-center gap-2">
        <span><FaInstagram size={22} className="text-danger" /></span>
        <Form.Control
          type="url"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="Link a Instagram (opcional)"
          autoComplete="off"
        />
      </Form.Group>
      <Form.Group className="mb-3 d-flex align-items-center gap-2">
        <span><FaYoutube size={22} className="text-danger" /></span>
        <Form.Control
          type="url"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          placeholder="Link a YouTube (opcional)"
          autoComplete="off"
        />
      </Form.Group>
      <Form.Group className="mb-3 d-flex align-items-center gap-2">
        <span><FaGlobe size={22} className="text-success" /></span>
        <Form.Control
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Sitio Web (opcional)"
          autoComplete="off"
        />
      </Form.Group>
      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={saving || loading}>
          {saving || loading ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving || loading}>
          Cancelar
        </Button>
      </div>
    </Form>
  );
};

export default EditarContacto;

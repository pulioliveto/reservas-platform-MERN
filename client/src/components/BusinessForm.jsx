import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';
import PhoneInputWhatsApp from './PhoneInputWhatsApp';

const BusinessForm = ({ formData, handleChange, handlePhoneChange }) => (
  <>
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Tipo de Negocio"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Dirección"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <PhoneInputWhatsApp
        value={formData.phone || ''}
        onChange={handlePhoneChange}
      />
    </Form.Group>
    <Form.Group className="mb-3 d-flex align-items-center gap-2">
      <span><FaFacebook size={22} className="text-primary" /></span>
      <Form.Control
        type="url"
        name="facebook"
        value={formData.facebook || ''}
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
        value={formData.instagram || ''}
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
        value={formData.youtube || ''}
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
        value={formData.website || ''}
        onChange={handleChange}
        placeholder="Sitio Web (opcional)"
        autoComplete="off"
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Duración de cada turno (minutos)</Form.Label>
      <Form.Select
        name="turnoDuration"
        value={formData.turnoDuration}
        onChange={handleChange}
        required
      >
        <option value={15}>15 minutos</option>
        <option value={30}>30 minutos</option>
        <option value={45}>45 minutos</option>
        <option value={60}>60 minutos</option>
      </Form.Select>
    </Form.Group>
  </>
);

export default BusinessForm;

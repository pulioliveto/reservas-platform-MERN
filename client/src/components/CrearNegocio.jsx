import React, { useState, useContext, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import { createBusiness } from '../services/apiBusiness';
import { AuthContext } from "../context/AuthContext";
import NeedLoginAlert from "../components/NeedLoginAlert";
import { getAuth } from 'firebase/auth';
import BackButton from '../components/BackButton';
import { getAccessToken } from '../services/googleCalendarService';
import { FaUpload } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Asegúrate de importar el CSS de react-calendar.
import CalendarioTurno from './CalendarioTurno';

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
    schedule: [],
  });
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!user) {
    return <NeedLoginAlert />;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleScheduleChange = (newSchedule) => {
    console.log('New Schedule:', newSchedule);
    setFormData((prevFormData) => ({
      ...prevFormData,
      schedule: newSchedule,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAccessToken();
    

      // Verifica que el schedule no esté vacío antes de enviarlo
  if (formData.schedule.length === 0) {
    alert("Por favor, agrega los horarios del negocio.");
    return;
  }

    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

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
        schedule: [],
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error al crear el negocio:', error);
      setMessage('Error al crear el negocio');
    }
  };

  return (
    <Container className="py-4">
      <BackButton />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="mb-4">
                <h3>Crear Negocio</h3>
              </div>
              {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    {/* Campos del formulario */}
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
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Sitio Web (opcional)"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="text-center">
                    {/* Subida de logo */}
                    <Form.Control
                      type="file"
                      name="logo"
                      onChange={handleChange}
                      className="d-none"
                      id="logo-upload"
                      accept="image/*"
                    />
                    <div
                      className="border border-dashed rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{ width: '150px', height: '150px', cursor: 'pointer', overflow: 'hidden' }}
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <FaUpload size={24} className="text-muted mb-2" />
                          <span className="text-muted small">Agregar LOGO</span>
                        </>
                      )}
                    </div>
                    {formData.logo && (
                      <p className="text-muted small mt-2">
                        {formData.logo.name}
                      </p>
                    )}
                  </Col>
                </Row>

              <CalendarioTurno onScheduleChange={handleScheduleChange} />
                <Button type="submit" className="mt-4">
                  Crear Negocio
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CrearNegocio;

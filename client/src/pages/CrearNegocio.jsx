import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import { createBusiness } from '../services/apiBusiness';
import { AuthContext } from "../context/AuthContext";
import NeedLoginAlert from "../components/NeedLoginAlert";
import BackButton from '../components/BackButton';
import { getAccessToken } from '../services/googleCalendarService';
import { FaUpload } from 'react-icons/fa';
import CalendarioTurno from '../components/CalendarioTurno';
import { useNavigate } from 'react-router-dom';
import BusinessForm from '../components/BusinessForm';
import LogoPreview from '../components/LogoPreview';

const CrearNegocio = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    // phone: '',
    facebook: '',
    instagram: '',
    youtube: '',
    website: '',
    logo: null,
    schedule: [],
    turnoDuration: 30, // Valor por defecto
  });
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scheduleError, setScheduleError] = useState('');
  const navigate = useNavigate();

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
    } else if (name === 'turnoDuration') {
      setFormData({
        ...formData,
        [name]: Number(value), // Asegura que turnoDuration sea un número
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData(prev => ({ ...prev, phone: phone ? phone.toString() : '' }));
  };

  const handleScheduleChange = (newSchedule) => {
    console.log('New Schedule:', newSchedule);
    setFormData((prevFormData) => ({
      ...prevFormData,
      schedule: newSchedule,
    }));
    setScheduleError(''); // Limpia el error cuando se modifica el schedule
  };

  const validateSchedule = (schedule) => {
    if (schedule.length === 0) {
      return "Por favor, agrega los horarios para al menos un día de la semana.";
    }

    // Filtrar solo los días abiertos (isOpen: true)
    const openDays = schedule.filter(day => day.isOpen);

    // Verifica que al menos un día esté abierto y tenga horarios definidos
    if (openDays.length === 0) {
      return "El negocio debe tener horarios definidos para al menos un día de la semana.";
    }

    // Verifica que los días abiertos tengan intervalos válidos
    const hasInvalidIntervals = openDays.some(day => {
      if (day.intervals && day.intervals.length > 0) {
        return day.intervals.some(interval => {
          if (!interval.startTime || !interval.endTime) {
            return true;
          }
          if (interval.startTime >= interval.endTime) {
            return true;
          }
          return false;
        });
      }
      // Si no hay intervalos en un día abierto, es inválido
      return true;
    });

    if (hasInvalidIntervals) {
      return "Por favor, completa correctamente los horarios para los días que el negocio está abierto (hora de inicio debe ser menor que hora de cierre).";
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAccessToken();

    // Validación de campos obligatorios
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validación del schedule
    const scheduleValidationError = validateSchedule(formData.schedule);
    if (scheduleValidationError) {
      setScheduleError(scheduleValidationError);
      return;
    }

    try {
      console.log("Datos a enviar:", {
        ...formData,
        schedule: formData.schedule,
        logo: formData.logo ? formData.logo.name : 'No logo'
      });

      await createBusiness(formData, token);
      setMessage('Negocio creado correctamente');
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        facebook: '',
        instagram: '',
        youtube: '',
        website: '',
        logo: null,
        schedule: [],
        turnoDuration: 30, // Valor por defecto
      });
      setPreviewUrl(null);
      setScheduleError('');
      setTimeout(() => {
        navigate('/tu-perfil');
      }, 1200);
    } catch (error) {
      console.error('Error al crear el negocio:', error);
      setMessage(error.message || 'Error al crear el negocio');
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
                    <BusinessForm formData={formData} handleChange={handleChange} handlePhoneChange={handlePhoneChange} />
                  </Col>
                  <Col md={4} className="text-center">
                    <LogoPreview logo={formData.logo} previewUrl={previewUrl} handleLogoChange={handleChange} />
                  </Col>
                </Row>

                <CalendarioTurno onScheduleChange={handleScheduleChange} />
                {scheduleError && <Alert variant="danger" className="mt-3">{scheduleError}</Alert>}
                
                <div className="mt-3 text-muted small">
                  <p>Nota: Puedes dejar sin horarios los días que el negocio permanezca cerrado.</p>
                </div>
                
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
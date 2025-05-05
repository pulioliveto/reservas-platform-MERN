import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ReservaModal = ({ show, onHide, selectedDay, selectedSlot, business, onConfirm, user }) => {
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setTelefono(user.phoneNumber || '');
    }
  }, [user]);

  const fecha = selectedDay ? format(selectedDay, 'EEEE dd/MM/yyyy', { locale: es }) : '';
  const hora = selectedSlot?.time || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!dni.trim()) newErrors.dni = "Debes completar este campo";
    if (!telefono.trim()) newErrors.telefono = "Debes completar este campo";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onConfirm({ dni, telefono, email, selectedSlot });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          </div>
          <ul className="list-group mb-3">
            <li className="list-group-item">
              <strong>Negocio:</strong> {business.name}
            </li>
            <li className="list-group-item">
              <strong>Día:</strong> {fecha}
            </li>
            <li className="list-group-item">
              <strong>Hora:</strong> {hora}
            </li>
          </ul>
          <Form.Group className="mb-3">
            <Form.Label>
              Número de DNI <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              isInvalid={!!errors.dni}
            />
            {errors.dni && (
              <div className="text-danger small mt-1">{errors.dni}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Número de Teléfono <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              isInvalid={!!errors.telefono}
            />
            {errors.telefono && (
              <div className="text-danger small mt-1">{errors.telefono}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Correo electrónico <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              readOnly
              required
            />
          </Form.Group>
          <div className="alert alert-info text-center">
            Recuerda llegar a tiempo a tu turno.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReservaModal;

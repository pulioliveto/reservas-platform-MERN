import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ReservaModal = ({ show, onHide, selectedDay, selectedSlot, business, onConfirm }) => {
  // Formatear fecha y hora para mostrar
  const fecha = selectedDay ? format(selectedDay, 'EEEE dd/MM/yyyy', { locale: es }) : '';
  const hora = selectedSlot?.time || '';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: '#007bff' }}></i>
        </div>
        <p className="text-center mb-3">
          <strong>¿Deseas confirmar la reserva?</strong>
        </p>
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
        <div className="alert alert-info text-center">
          Recuerda llegar a tiempo a tu turno.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => onConfirm(selectedSlot)}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservaModal;

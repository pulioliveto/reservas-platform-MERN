import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReservaModal = ({ show, onHide, selectedDay, selectedSlot, business, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         {/* Mostrar el logo si existe */}
         {business.logo && (
          <div className="text-center mb-3">
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            />
          </div>
        )}
        <p><strong>Negocio:</strong> {business.name}</p>
        <p><strong>Fecha:</strong> {selectedDay && selectedDay.toLocaleDateString('es-ES')}</p>
        <p><strong>Horario:</strong> {selectedSlot}</p>
        <p><strong>Costo:</strong> ${business?.price || 'Consultar'}</p>
        <Form>
          <Form.Group>
            <Form.Label>Seleccionar Tratamiento</Form.Label>
            <Form.Control as="select">
              {business?.treatments?.map((treatment, index) => (
                <option key={index} value={treatment}>{treatment}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
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

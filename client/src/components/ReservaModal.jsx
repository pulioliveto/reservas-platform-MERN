"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FaCalendarAlt, FaClock, FaUser, FaIdCard, FaPhone, FaEnvelope, FaUserTie, FaCheck } from "react-icons/fa"
import "../css/ReservaModal.css"

const ReservaModal = ({ show, onHide, selectedDay, selectedSlot, business, onConfirm, user, empleados = [] }) => {
  const [formData, setFormData] = useState({
    dni: "",
    telefono: "",
    email: user?.email || "",
    empleadoId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setIsSubmitting(true)

    try {
      await onConfirm({
        ...formData,
        selectedSlot,
      })
    } catch (error) {
      console.error("Error al confirmar reserva:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedDay || !selectedSlot || !business) return null

  const dayName = format(selectedDay, "EEEE", { locale: es })
  const formattedDate = format(selectedDay, "d 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <Modal show={show} onHide={onHide} centered className="reserva-modal">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <div className="modal-icon me-2">
            <FaCalendarAlt />
          </div>
          Confirmar Reserva
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="reservation-details mb-4">
          <div className="reservation-business">
            <h5 className="fw-bold mb-3">{business.name}</h5>
            <p className="text-muted mb-0">{business.description}</p>
          </div>

          <div className="reservation-info mt-4">
            <div className="info-item">
              <div className="info-icon">
                <FaCalendarAlt />
              </div>
              <div className="info-content">
                <div className="info-label">Fecha</div>
                <div className="info-value">
                  {dayName}, {formattedDate}
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaClock />
              </div>
              <div className="info-content">
                <div className="info-label">Hora</div>
                <div className="info-value">{selectedSlot.time}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaUser />
              </div>
              <div className="info-content">
                <div className="info-label">Cliente</div>
                <div className="info-value">{user?.displayName || "Cliente"}</div>
              </div>
            </div>
          </div>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>DNI</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaIdCard className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ingresa tu DNI"
                required
                className="border-start-0 ps-0"
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">El DNI es obligatorio</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaPhone className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingresa tu teléfono"
                required
                className="border-start-0 ps-0"
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">El teléfono es obligatorio</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaEnvelope className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                required
                className="border-start-0 ps-0"
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">El email es obligatorio</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {empleados.length > 0 && (
            <Form.Group className="mb-4">
              <Form.Label>Profesional (opcional)</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaUserTie className="text-primary" />
                </InputGroup.Text>
                <Form.Select
                  name="empleadoId"
                  value={formData.empleadoId}
                  onChange={handleChange}
                  className="border-start-0 ps-0"
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar profesional...</option>
                  {empleados.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.nombre}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
              <Form.Text className="text-muted">
                Puedes seleccionar un profesional específico o dejarlo en blanco
              </Form.Text>
            </Form.Group>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" className="confirm-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Confirmando...
                </>
              ) : (
                <>
                  <FaCheck className="me-2" /> Confirmar Reserva
                </>
              )}
            </Button>
            <Button variant="outline-secondary" onClick={onHide} className="cancel-button" disabled={isSubmitting}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ReservaModal

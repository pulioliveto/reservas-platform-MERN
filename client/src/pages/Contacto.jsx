"use client"

import { useState } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { FaEnvelope, FaWhatsapp, FaInstagram, FaPaperPlane, FaUser, FaCommentAlt } from "react-icons/fa"
import "../css/Contacto.css"

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [validated, setValidated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState({ success: false, message: "" })
  const [showAlert, setShowAlert] = useState(false)

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

    // envío de formulario
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      // espera de 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitResult({
        success: true,
        message: "¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.",
      })
      setShowAlert(true)

      // Limpiar el formulario
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setValidated(false)

      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.",
      })
      setShowAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contacto-page">
      {/* Formas geométricas de fondo */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <Container className="position-relative z-index-1">
        {/* Sección de encabezado */}
        <section className="contacto-header text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Contacto</h1>
          <p className="lead mb-5">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros y te responderemos a la brevedad.
          </p>
        </section>

        <Row className="g-4 mb-5">
          {/* Columna del formulario */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4 p-lg-5">
                <h2 className="fw-bold mb-4 d-flex align-items-center">
                  <FaEnvelope className="me-3 text-primary" />
                  Envíanos un mensaje
                </h2>

                {showAlert && (
                  <Alert
                    variant={submitResult.success ? "success" : "danger"}
                    className="animate__animated animate__fadeIn"
                    onClose={() => setShowAlert(false)}
                    dismissible
                  >
                    {submitResult.message}
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaUser className="text-primary" />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        className="border-start-0 ps-0"
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">Por favor ingresa tu nombre</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaEnvelope className="text-primary" />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="border-start-0 ps-0"
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">Por favor ingresa un email válido</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Asunto</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaCommentAlt className="text-primary" />
                      </span>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Asunto de tu mensaje"
                        required
                        className="border-start-0 ps-0"
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">Por favor ingresa el asunto</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      rows={5}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">Por favor ingresa tu mensaje</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" /> Enviar mensaje
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Columna de información de contacto */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4 p-lg-5">
                <h2 className="fw-bold mb-4">Información de contacto</h2>
                <p className="text-muted mb-4">
                  Puedes contactarnos directamente a través de nuestros canales de comunicación o utilizar el
                  formulario.
                </p>

                <div className="contact-info">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <FaWhatsapp />
                    </div>
                    <div className="contact-content">
                      <h5 className="contact-title">WhatsApp</h5>
                      <p className="contact-text">
                        <a
                          href="https://wa.me/393444977833"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link"
                        >
                          +39 344 497 7833
                        </a>
                      </p>
                      <p className="contact-description">Soporte disponible de lunes a viernes de 9:00 a 18:00 hs.</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon instagram-icon">
                      <FaInstagram />
                    </div>
                    <div className="contact-content">
                      <h5 className="contact-title">Instagram</h5>
                      <p className="contact-text">
                        <a
                          href="https://instagram.com/reservaturnos.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link"
                        >
                          @reservaturnos.app
                        </a>
                      </p>
                      <p className="contact-description">
                        Síguenos para estar al tanto de novedades y actualizaciones.
                      </p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <FaEnvelope />
                    </div>
                    <div className="contact-content">
                      <h5 className="contact-title">Email</h5>
                      <p className="contact-text">
                        <a href="mailto:reservaturnosapp@gmail.com" className="contact-link">
                          reservaturnosapp@gmail.com
                        </a>
                      </p>
                      <p className="contact-description">Respondemos en un plazo máximo de 24 horas.</p>
                    </div>
                  </div>
                </div>

                <div className="social-cta mt-5">
                  <h5 className="mb-3">¿Prefieres contactarnos por WhatsApp?</h5>
                  <a
                    href="https://wa.me/39344977833"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-lg d-flex align-items-center justify-content-center whatsapp-button"
                  >
                    <FaWhatsapp className="me-2" /> Contactar por WhatsApp
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de preguntas frecuentes */}
        <section className="faq-section py-5">
          <h2 className="text-center fw-bold mb-5">Preguntas frecuentes</h2>

          <Row className="g-4">
            <Col md={6}>
              <div className="faq-item">
                <h5 className="faq-question">¿El servicio es realmente gratuito?</h5>
                <p className="faq-answer">
                  Sí, ReservaTurnos es completamente gratuito para todos los negocios. No hay costos ocultos ni planes
                  premium.
                </p>
              </div>
            </Col>

            <Col md={6}>
              <div className="faq-item">
                <h5 className="faq-question">¿Cómo puedo empezar a usar ReservaTurnos?</h5>
                <p className="faq-answer">
                  Simplemente regístrate con tu cuenta de Google, crea tu negocio y comienza a recibir reservas.
                </p>
              </div>
            </Col>

            <Col md={6}>
              <div className="faq-item">
                <h5 className="faq-question">¿Puedo personalizar los horarios de mi negocio?</h5>
                <p className="faq-answer">
                  Sí, puedes configurar los días y horarios en los que tu negocio está disponible para recibir reservas.
                </p>
              </div>
            </Col>

            <Col md={6}>
              <div className="faq-item">
                <h5 className="faq-question">¿Cómo reciben mis clientes las confirmaciones?</h5>
                <p className="faq-answer">
                  Los clientes reciben confirmaciones por email y pueden ver sus reservas en su perfil de ReservaTurnos.
                </p>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  )
}

export default Contacto

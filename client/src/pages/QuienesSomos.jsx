"use client"

import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {
  FaCalendarCheck,
  FaLightbulb,
  FaUsers,
  FaHandshake,
  FaRocket,
  FaChartLine,
  FaArrowRight,
  FaStore,
  FaLock,
  FaGlobe,
} from "react-icons/fa"
import imgQuienesSomos from "../img/quienes-somos.png"
import "../css/QuienesSomos.css"

const QuienesSomos = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/crear-negocio")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="quienes-somos-page">
      {/* Formas geométricas de fondo */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <Container className="position-relative z-index-1">
        {/* Sección de introducción */}
        <section className="intro-section text-center py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Quiénes Somos</h1>
              <p className="lead mb-5">
                En ReservaTurnos creemos que la tecnología debe ser accesible para todos. Somos un servicio{" "}
                <span className="text-primary fw-bold">100% gratuito</span> que ayuda a pequeñas y medianas empresas a
                gestionar sus reservas de manera eficiente y profesional.
              </p>
            </Col>
          </Row>
        </section>

        {/* Sección de misión y visión */}
        <section className="mission-section py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="mission-image-container">
                <img
                  src={imgQuienesSomos}
                  alt="Nuestra misión"
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mission-content">
                <h2 className="fw-bold mb-4">Nuestra Misión</h2>
                <p className="mb-4">
                  Democratizar el acceso a herramientas de gestión de turnos para que cualquier negocio, sin importar su
                  tamaño, pueda optimizar su tiempo y brindar una mejor experiencia a sus clientes.
                </p>
                <div className="mission-values">
                  <div className="mission-value-item">
                    <div className="mission-value-icon">
                      <FaLightbulb />
                    </div>
                    <div className="mission-value-text">
                      <h5 className="fw-bold">Innovación</h5>
                      <p>Desarrollamos soluciones simples para problemas complejos.</p>
                    </div>
                  </div>
                  <div className="mission-value-item">
                    <div className="mission-value-icon">
                      <FaHandshake />
                    </div>
                    <div className="mission-value-text">
                      <h5 className="fw-bold">Compromiso</h5>
                      <p>Nos comprometemos con el crecimiento de cada negocio que confía en nosotros.</p>
                    </div>
                  </div>
                  <div className="mission-value-item">
                    <div className="mission-value-icon">
                      <FaUsers />
                    </div>
                    <div className="mission-value-text">
                      <h5 className="fw-bold">Comunidad</h5>
                      <p>Creemos en el poder de conectar negocios con sus clientes de manera eficiente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Sección de por qué somos gratuitos */}
        <section className="free-section py-5">
          <div className="free-section-content text-center">
            <h2 className="fw-bold mb-4">¿Por qué somos gratuitos?</h2>
            <p className="lead mb-5">
              Creemos que todas las PYMES merecen acceso a herramientas profesionales sin barreras económicas. Nuestro
              compromiso es mantener ReservaTurnos como un servicio gratuito para impulsar el crecimiento de los
              pequeños negocios.
            </p>

            <Row className="row-cols-1 row-cols-md-3 g-4">
              <Col>
                <Card className="h-100 free-card border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="free-icon">
                      <FaRocket />
                    </div>
                    <Card.Title className="fw-bold mt-4">Impulsamos PYMES</Card.Title>
                    <Card.Text>
                      Queremos ser parte del crecimiento de los pequeños negocios, ofreciendo herramientas que antes
                      solo estaban al alcance de grandes empresas.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <Card className="h-100 free-card border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="free-icon">
                      <FaChartLine />
                    </div>
                    <Card.Title className="fw-bold mt-4">Crecemos juntos</Card.Title>
                    <Card.Text>
                      Nuestro éxito está directamente vinculado al éxito de los negocios que utilizan nuestra
                      plataforma. Si ellos crecen, nosotros crecemos.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <Card className="h-100 free-card border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="free-icon">
                      <FaCalendarCheck />
                    </div>
                    <Card.Title className="fw-bold mt-4">Simplicidad ante todo</Card.Title>
                    <Card.Text>
                      Creemos que la gestión de turnos debe ser simple y accesible para todos, sin complicaciones ni
                      costos ocultos.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* Sección de beneficios */}
        <section className="benefits-section py-5">
          <h2 className="text-center fw-bold mb-5">Beneficios para tu negocio</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaStore />
              </div>
              <h4 className="benefit-title">Presencia profesional</h4>
              <p className="benefit-description">
                Ofrece a tus clientes una experiencia de reserva profesional que refleja la calidad de tu negocio.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaCalendarCheck />
              </div>
              <h4 className="benefit-title">Gestión eficiente</h4>
              <p className="benefit-description">
                Optimiza tu tiempo y recursos con un sistema que organiza automáticamente tus reservas.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaUsers />
              </div>
              <h4 className="benefit-title">Fideliza clientes</h4>
              <p className="benefit-description">
                Mejora la experiencia de tus clientes con un sistema de reservas simple y efectivo.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaLock />
              </div>
              <h4 className="benefit-title">Seguridad garantizada</h4>
              <p className="benefit-description">
                Tus datos y los de tus clientes están protegidos con los más altos estándares de seguridad.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaGlobe />
              </div>
              <h4 className="benefit-title">Acceso desde cualquier lugar</h4>
              <p className="benefit-description">
                Gestiona tu negocio desde cualquier dispositivo con conexión a internet, en cualquier momento.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaChartLine />
              </div>
              <h4 className="benefit-title">Análisis y estadísticas</h4>
              <p className="benefit-description">
                Obtén información valiosa sobre tu negocio para tomar mejores decisiones.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de CTA */}
        <section className="cta-section text-center py-5">
          <Card className="border-0 shadow p-5 bg-gradient">
            <Card.Body>
              <h2 className="fw-bold mb-4">¿Listo para optimizar tu negocio?</h2>
              <p className="lead mb-4">
                Únete a miles de negocios que ya gestionan sus reservas con ReservaTurnos, ¡completamente gratis!
              </p>
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill fw-bold px-5 py-3 cta-button"
                onClick={handleGetStarted}
              >
                Comenzar ahora <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  )
}

export default QuienesSomos

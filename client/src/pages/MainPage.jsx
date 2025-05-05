"use client"
import { Link, useNavigate } from "react-router-dom"
import NeedLoginAlert from "../components/NeedLoginAlert"
import { useAuth } from "../hooks/useAuth"
import { Button, Card, Container, Row, Col } from "react-bootstrap"
import "../css/MainPage.css"

const MainPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleCreateBusiness = () => {
    if (!isAuthenticated) {
      return
    }
    navigate("/crear-negocio")
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden py-5">
        {/* Formas geométricas de fondo */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        <Container className="position-relative z-index-1">
          <Row className="align-items-center py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Gestiona tus reservas de forma simple y eficiente</h1>
              <p className="lead mb-4">
                Optimiza tu negocio con nuestra plataforma de gestión de turnos. Ahorra tiempo, reduce cancelaciones y
                mejora la experiencia de tus clientes.
              </p>
              <div className="d-flex gap-3">
                <Button
                  variant="dark"
                  size="lg"
                  className="rounded-pill fw-bold px-4"
                  onClick={handleCreateBusiness}
                >
                  <i className="bi bi-shop me-2"></i> Tengo un negocio
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill fw-bold px-4"
                  as={Link}
                  to="/reservar-turno"
                >
                  <i className="bi bi-calendar-check me-2"></i> Reservar turno
                </Button>
              </div>
              {/* {!isAuthenticated && <NeedLoginAlert className="mt-3" />} */}
            </Col>
            <Col lg={6} className="text-center">
             
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container className="py-4">
          <h2 className="text-center fw-bold mb-5">¿Por qué elegir ReservaTurnos?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3 mx-auto">
                    <i className="bi bi-calendar-plus fs-4"></i>
                  </div>
                  <Card.Title className="fw-bold">Gestión simplificada</Card.Title>
                  <Card.Text>
                    Administra todos tus turnos desde un solo lugar, con una interfaz intuitiva y fácil de usar.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3 mx-auto">
                    <i className="bi bi-bell fs-4"></i>
                  </div>
                  <Card.Title className="fw-bold">Notificaciones automáticas</Card.Title>
                  <Card.Text>Reduce las ausencias con recordatorios automáticos para tus clientes.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon bg-primary text-white rounded-circle mb-3 mx-auto">
                    <i className="bi bi-graph-up fs-4"></i>
                  </div>
                  <Card.Title className="fw-bold">Análisis y estadísticas</Card.Title>
                  <Card.Text>Obtén información valiosa sobre tu negocio para tomar mejores decisiones.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-white">
        <Container className="py-4 text-center">
          <Card className="border-0 shadow p-5 bg-gradient">
            <Card.Body>
              <h2 className="fw-bold mb-4">¿Listo para empezar?</h2>
              <p className="lead mb-4">Únete a miles de negocios que ya optimizan su gestión de turnos</p>
              <Button variant="primary" size="lg" className="rounded-pill fw-bold px-5" onClick={handleCreateBusiness}>
                Comenzar ahora
              </Button>
              {/* {!isAuthenticated && <NeedLoginAlert className="mt-3" />} */}
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">ReservaTurnos</h5>
              <p className="mb-0">La solución completa para la gestión de turnos y reservas de tu negocio.</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Enlaces rápidos</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/como-funciona" className="text-white text-decoration-none">
                    Cómo funciona
                  </Link>
                </li>
                <li>
                  <Link to="/precios" className="text-white text-decoration-none">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-white text-decoration-none">
                    Contacto
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-3">Contáctanos</h5>
              <p className="mb-0">
                <i className="bi bi-envelope me-2"></i> info@reservaturnos.com
                <br />
                <i className="bi bi-telephone me-2"></i> +123 456 7890
              </p>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} ReservaTurnos. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default MainPage

import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { useAuth } from "../hooks/useAuth"
import {
  FaUserPlus,
  FaStore,
  FaClock,
  FaShareAlt,
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaPalette,
  FaMobileAlt,
  FaArrowRight,
} from "react-icons/fa"
import "../css/ComoFunciona.css"

const ComoFunciona = () => {
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
    <div className="como-funciona-page">
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
              <h1 className="display-4 fw-bold mb-4">Cómo Funciona</h1>
              <p className="lead mb-5">
                Gestioná tus reservas y tu negocio en un solo lugar, desde cualquier dispositivo. Sin complicaciones,
                sin papeles.
              </p>
            </Col>
          </Row>
        </section>

        {/* Sección de pasos */}
        <section className="steps-section py-5">
          <h2 className="text-center fw-bold mb-5">Comienza en simples pasos</h2>

          <div className="steps-container">
            {/* Paso 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-icon">
                  <FaUserPlus />
                </div>
                <h3 className="step-title">Registrate gratis</h3>
                <p className="step-description">Creamos una cuenta con Google en segundos. Sin tarjetas.</p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-icon">
                  <FaStore />
                </div>
                <h3 className="step-title">Crea tu negocio</h3>
                <p className="step-description">Completá el nombre, logo, rubro y empezá a recibir reservas.</p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-icon">
                  <FaClock />
                </div>
                <h3 className="step-title">Configurá tus horarios</h3>
                <p className="step-description">Definí los días y horas en los que querés recibir clientes.</p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <div className="step-icon">
                  <FaShareAlt />
                </div>
                <h3 className="step-title">Compartí tu enlace</h3>
                <p className="step-description">Tus clientes pueden reservar desde su celular en segundos.</p>
              </div>
            </div>

            {/* Paso 5 */}
            <div className="step-card">
              <div className="step-number">5</div>
              <div className="step-content">
                <div className="step-icon">
                  <FaChartBar />
                </div>
                <h3 className="step-title">Administrá todo</h3>
                <p className="step-description">
                  Visualizá reservas, modificá turnos y accedé al perfil de cada cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de beneficios */}
        <section className="benefits-section py-5">
          <h2 className="text-center fw-bold mb-5">Beneficios principales</h2>

          <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {/* Beneficio 1 */}
            <Col>
              <Card className="h-100 benefit-card border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="benefit-icon">
                    <FaCalendarAlt />
                  </div>
                  <Card.Title className="fw-bold mt-4">Gestión de turnos</Card.Title>
                  <Card.Text>Visualizá, editá y cancelá reservas fácilmente.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Beneficio 2 */}
            <Col>
              <Card className="h-100 benefit-card border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="benefit-icon">
                    <FaUsers />
                  </div>
                  <Card.Title className="fw-bold mt-4">Base de datos de clientes</Card.Title>
                  <Card.Text>Accedé al historial de cada cliente.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Beneficio 3 */}
            <Col>
              <Card className="h-100 benefit-card border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="benefit-icon">
                    <FaPalette />
                  </div>
                  <Card.Title className="fw-bold mt-4">Personalizá tu negocio</Card.Title>
                  <Card.Text>Subí tu logo y mostrá tu marca.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Beneficio 4 */}
            <Col>
              <Card className="h-100 benefit-card border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="benefit-icon">
                    <FaMobileAlt />
                  </div>
                  <Card.Title className="fw-bold mt-4">100% online y mobile-ready</Card.Title>
                  <Card.Text>Tus clientes pueden reservar desde cualquier dispositivo.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Sección de demostración visual */}
        <section className="demo-section py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Visualiza tu negocio en acción</h2>
              <p className="mb-4">
                ReservaTurnos te ofrece una interfaz intuitiva y fácil de usar que te permite gestionar todas tus
                reservas desde un solo lugar. Visualiza tu calendario, administra tus clientes y optimiza tu tiempo.
              </p>
              <ul className="feature-list">
                <li>
                  <span className="feature-check">✓</span> Panel de control intuitivo
                </li>
                <li>
                  <span className="feature-check">✓</span> Notificaciones automáticas
                </li>
                <li>
                  <span className="feature-check">✓</span> Estadísticas de tu negocio
                </li>
                <li>
                  <span className="feature-check">✓</span> Acceso desde cualquier dispositivo
                </li>
              </ul>
            </Col>
            {/* <Col lg={6} className="text-center">
              <div className="demo-image-container">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Demostración de ReservaTurnos"
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </Col> */}
          </Row>
        </section>

        {/* Sección de CTA */}
        <section className="cta-section text-center py-5">
          <Card className="border-0 shadow p-5 bg-gradient">
            <Card.Body>
              <h2 className="fw-bold mb-4">¿Listo para optimizar tu negocio?</h2>
              <p className="lead mb-4">Únete a miles de negocios que ya gestionan sus reservas con ReservaTurnos</p>
              <Button
                variant="primary"
                size="lg"
                className="cta-button rounded-pill fw-bold px-5 py-3"
                onClick={handleGetStarted}
              >
                Empieza ahora – ¡Es gratis! <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  )
}

export default ComoFunciona

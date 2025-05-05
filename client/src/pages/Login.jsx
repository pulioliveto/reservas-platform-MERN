"use client"

import { useContext, useState } from "react"
import { Container, Card, Button, Row, Col, Image } from "react-bootstrap"
import { FcGoogle } from "react-icons/fc"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import logo from "../img/logo.png"
import "../css/Login.css"

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      navigate("/")
    } catch (error) {
      console.error("Error during sign-in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-shape shape-1"></div>
        <div className="login-shape shape-2"></div>
        <div className="login-shape shape-3"></div>
      </div>

      <Container className="login-container">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
            <Card className="login-card border-0 shadow">
              <Card.Body className="p-3 p-md-4">
                <div className="text-center mb-3">
                  <Image src={logo || "/placeholder.svg"} alt="ReservaTurnos" className="login-logo mb-3" />
                  <h2 className="fw-bold mb-1">Bienvenido</h2>
                  <p className="text-muted">Inicia sesión para gestionar tus reservas</p>
                </div>

                <div className="login-divider">
                  <span>Acceder con</span>
                </div>

                <div className="d-grid mt-3">
                  <Button
                    variant="light"
                    size="lg"
                    className="login-google-button"
                    onClick={handleSignIn}
                    disabled={isLoading}
                  >
                    <FcGoogle size={22} />
                    <span>{isLoading ? "Conectando..." : "Continuar con Google"}</span>
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="login-footer-text">
                    Al iniciar sesión, aceptas nuestros{" "}
                    <a href="/terminos" className="text-decoration-none">
                      Términos de servicio
                    </a>{" "}
                    y{" "}
                    <a href="/privacidad" className="text-decoration-none">
                      Política de privacidad
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login

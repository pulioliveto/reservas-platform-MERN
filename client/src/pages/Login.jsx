import React, { useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <Container className="d-flex align-items-start justify-content-center pt-5">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Iniciar sesión</h2>
                <p className="text-muted">Bienvenido de nuevo</p>
              </div>

              <div className="d-grid gap-3">
                <Button 
                  variant="outline-dark" 
                  size="lg" 
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleSignIn}
                >
                  <FcGoogle size={20} />
                  Acceder con Google
                </Button>
                
                <div className="text-center">
                  <small className="text-muted">
                    ¿No tienes una cuenta?{' '}
                    <a href="/register" className="text-decoration-none">
                      Regístrate
                    </a>
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
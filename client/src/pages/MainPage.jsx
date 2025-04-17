import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeedLoginAlert from '../components/NeedLoginAlert';
import { useAuth } from '../hooks/useAuth'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Nav, Navbar } from 'react-bootstrap'
import '../css/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Verifica si el usuario está autenticado
  const handleCreateBusiness = () => {
       // Si no está autenticado, muestra la alerta
    if (!isAuthenticated) {
      // No hacemos nada más aquí porque el componente `NeedLoginAlert` se encargará de la redirección
      return;
    }
    // Si está autenticado, redirigimos a la página de creación de negocio
    navigate('/crear-negocio');
  };



  return (
    <div className="min-vh-100 d-flex flex-column bg-light">

      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Card className="w-100 shadow" style={{maxWidth: '500px'}}>
          <Card.Body className="text-center p-5">
            <h1 className="mb-4 fw-bold">Bienvenido a la Plataforma de Gestión de Reservas</h1>
            <p className="text-muted mb-4">Seleccione una de las opciones para comenzar</p>
            <div className="d-grid gap-3">
              <Link 
                to="/crear-negocio" 
                className="btn btn-primary btn-lg py-3"
                onClick={handleCreateBusiness}
              >
                <i className="bi bi-shop"></i> Tengo un negocio
              </Link>
              {!isAuthenticated && <NeedLoginAlert />}
              <Link 
                to="/reservar-turno" 
                className="btn btn-outline-secondary btn-lg py-3"
              >
                <i className="bi bi-calendar-check"></i> Quiero reservar un turno
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
};

export default MainPage;
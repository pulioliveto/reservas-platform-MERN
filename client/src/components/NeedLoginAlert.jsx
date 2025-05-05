"use client"
import { Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaExclamationTriangle, FaSignInAlt } from "react-icons/fa"

const NeedLoginAlert = ({ className = "" }) => {
  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <Alert variant="warning" className={`d-flex align-items-center ${className}`}>
      <FaExclamationTriangle className="me-2 flex-shrink-0" size={18} />
      <div className="flex-grow-1">Para crear un negocio, necesitas iniciar sesión en tu cuenta.</div>
      <Button variant="primary" size="sm" onClick={redirectToLogin} className="ms-3 rounded-pill">
        <FaSignInAlt className="me-1" /> Iniciar sesión
      </Button>
    </Alert>
  )
}

export default NeedLoginAlert

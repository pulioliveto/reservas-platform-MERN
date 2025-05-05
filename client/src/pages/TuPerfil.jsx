import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUserBusinesses, deleteBusiness } from "../services/apiBusiness"
import { getAuth } from "firebase/auth"
import BackButton from "../components/BackButton"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import {
  FaBuilding,
  FaPlus,
  FaTrashAlt,
  FaEye,
  FaExclamationTriangle,
  FaSignInAlt,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa"

const TuPerfil = () => {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [noAuth, setNoAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        if (!auth.currentUser) {
          setNoAuth(true)
          setLoading(false)
          return
        }
        const token = await auth.currentUser.getIdToken(true)
        const response = await getUserBusinesses(token)
        setBusinesses(response)
      } catch (error) {
        console.error("Error al obtener los negocios:", error)
        toast.error("Error al obtener los negocios: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const handleDelete = async (id, businessName) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      html: `Vas a eliminar <strong>${businessName}</strong>.<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    })

    if (result.isConfirmed) {
      try {
        const auth = getAuth()
        const token = await auth.currentUser.getIdToken(true)
        await deleteBusiness(id, token)
        setBusinesses((prevBusinesses) => prevBusinesses.filter((b) => b._id !== id))
        toast.success("Negocio eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar el negocio:", error)
        toast.error("No se pudo eliminar el negocio. Intenta nuevamente.")
      }
    }
  }

  const handleCreateBusiness = () => {
    navigate("/crear-negocio")
  }

  const renderBusinessLogo = (business) => {
    if (business.logo) {
      return (
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${business.logo.replace("\\", "/")}`}
          alt={`${business.name} logo`}
          className="business-logo"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg?height=80&width=80"
          }}
        />
      )
    }
    return (
      <div className="business-logo-placeholder">
        <FaStore size={24} />
      </div>
    )
  }

  if (noAuth) {
    return (
      <div className="bg-light py-5 min-vh-100">
        <div className="container">
          <div className="d-flex align-items-center mb-4">
            <BackButton className="me-3" />
            <h2 className="mb-0 fw-bold text-primary">Tu Perfil</h2>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <FaExclamationTriangle size={48} className="text-warning mb-3" />
                <h4 className="fw-bold">Acceso restringido</h4>
                <p className="text-muted">Debes iniciar sesión para ver tus negocios.</p>
              </div>
              <button
                className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
                onClick={() => navigate("/login")}
              >
                <FaSignInAlt className="me-2" /> Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <BackButton className="me-3" />
            <h2 className="mb-0 fw-bold text-primary">Tus Negocios</h2>
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
            onClick={handleCreateBusiness}
          >
            <FaPlus className="me-2" /> Crear nuevo negocio
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tus negocios...</p>
          </div>
        ) : businesses.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {businesses.map((business) => (
              <div key={business._id} className="col">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body p-0">
                    <div className="business-header" onClick={() => navigate(`/negocio/${business._id}`)}>
                      <div className="business-logo-container">{renderBusinessLogo(business)}</div>
                      <div className="p-3">
                        <h5 className="card-title fw-bold mb-1">{business.name}</h5>
                        <p className="card-text text-muted small mb-2">{business.description}</p>

                        {business.address && (
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <FaMapMarkerAlt className="me-1" size={12} />
                            <span className="text-truncate">{business.address}</span>
                          </div>
                        )}

                        {business.phone && (
                          <div className="d-flex align-items-center text-muted small">
                            <FaPhone className="me-1" size={12} />
                            <span>{business.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top p-3">
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => navigate(`/negocio/${business._id}`)}
                      >
                        <FaEye className="me-1" /> Ver
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(business._id, business.name)
                        }}
                      >
                        <FaTrashAlt className="me-1" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <FaBuilding size={48} className="text-muted opacity-25 mb-3" />
                <h4 className="fw-bold">No tienes negocios creados</h4>
                <p className="text-muted">Comienza creando tu primer negocio para gestionar tus reservas.</p>
              </div>
              <button
                className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
                onClick={handleCreateBusiness}
              >
                <FaPlus className="me-2" /> Crear mi primer negocio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TuPerfil

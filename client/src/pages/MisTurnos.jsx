import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth } from "firebase/auth"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { eliminarReserva } from "../services/apiReservation"
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaStore,
  FaClock,
  FaCalendarDay,
  FaArrowLeft,
  FaPlus,
  FaExclamationTriangle,
} from "react-icons/fa"
import BackButton from "../components/BackButton"
import '../css/MisTurnos.css'

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) {
          setError("Debes iniciar sesión para ver tus turnos")
          setLoading(false)
          return
        }
        const token = await user.getIdToken()
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/mis-turnos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setTurnos(data)
        } else {
          setError("Error al cargar los turnos")
        }
      } catch (error) {
        console.error("Error en la solicitud:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchTurnos()
  }, [])

  const handleReservarTurno = () => {
    navigate("/reservar-turno")
  }

  const handleCancelar = async (turnoId, negocioNombre) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      html: `Vas a cancelar tu turno en <strong>${negocioNombre || "este negocio"}</strong>.<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cancelar turno",
      cancelButtonText: "No, conservar turno",
      reverseButtons: true,
      focusCancel: true,
    })
    if (result.isConfirmed) {
      try {
        await eliminarReserva(turnoId)
        setTurnos((prev) => prev.filter((t) => t._id !== turnoId))
        toast.success("Turno cancelado exitosamente")
      } catch (error) {
        toast.error("No se pudo cancelar el turno")
      }
    }
  }

  // Función para agrupar turnos por fecha
  const getTurnosByDate = () => {
    const grouped = {}

    // Ordenar turnos por fecha (más recientes primero)
    const sortedTurnos = [...turnos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    sortedTurnos.forEach((turno) => {
      const fecha = new Date(turno.fecha).toLocaleDateString()
      if (!grouped[fecha]) {
        grouped[fecha] = []
      }
      grouped[fecha].push(turno)
    })

    return grouped
  }

  // Función para formatear la fecha en formato más legible
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Verificar si una fecha es hoy
  const isToday = (dateString) => {
    const today = new Date()
    const date = new Date(dateString)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Verificar si una fecha es en el futuro
  const isFutureDate = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(dateString)
    return date > today
  }

  const turnosByDate = getTurnosByDate()

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <BackButton className="me-3" />
            <h2 className="mb-0 fw-bold text-primary">Mis Turnos</h2>
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
            onClick={handleReservarTurno}
          >
            <FaPlus className="me-2" /> Reservar nuevo turno
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tus turnos...</p>
          </div>
        ) : error ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <FaExclamationTriangle size={48} className="text-warning mb-3" />
                <h4 className="fw-bold">No se pudieron cargar tus turnos</h4>
                <p className="text-muted">{error}</p>
              </div>
              <button
                className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
                onClick={() => navigate("/")}
              >
                <FaArrowLeft className="me-2" /> Volver al inicio
              </button>
            </div>
          </div>
        ) : turnos.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <FaCalendarCheck size={48} className="text-muted opacity-25 mb-3" />
                <h4 className="fw-bold">No tienes turnos reservados</h4>
                <p className="text-muted">Reserva un turno en cualquiera de nuestros negocios disponibles.</p>
              </div>
              <button
                className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center"
                onClick={handleReservarTurno}
              >
                <FaPlus className="me-2" /> Reservar turno
              </button>
            </div>
          </div>
        ) : (
          <div className="turnos-container">
            {Object.entries(turnosByDate).map(([fecha, turnosEnFecha]) => (
              <div key={fecha} className="mb-4">
                <div className="date-header d-flex align-items-center mb-3">
                  <div className="date-badge me-3">
                    <FaCalendarDay size={18} />
                  </div>
                  <h5 className="mb-0 fw-bold">
                    {isToday(turnosEnFecha[0].fecha) ? (
                      <span className="text-primary">Hoy</span>
                    ) : (
                      formatDate(turnosEnFecha[0].fecha)
                    )}
                    {isFutureDate(turnosEnFecha[0].fecha) && <span className="badge bg-primary ms-2">Próximo</span>}
                  </h5>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {turnosEnFecha.map((turno) => (
                    <div key={turno._id} className="col">
                      <div className="card border-0 shadow-sm h-100 turno-card">
                        <div className="card-body p-0">
                          <div className="d-flex">
                            <div className="turno-time-container">
                              <div className="turno-time">
                                <div className="turno-time-hour">{turno.turno}</div>
                                <div className="turno-time-date">{new Date(turno.fecha).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="p-3 flex-grow-1">
                              <h5 className="card-title fw-bold mb-2">{turno.negocioId?.name || "Negocio"}</h5>
                              <div className="d-flex align-items-center text-muted mb-2">
                                <FaStore className="me-2" size={14} />
                                <span>{turno.negocioId?.description || "Sin descripción"}</span>
                              </div>
                              <div className="d-flex align-items-center text-muted">
                                <FaClock className="me-2" size={14} />
                                <span>Duración: {turno.negocioId?.turnoDuration || 30} minutos</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-white border-top p-3">
                          <button
                            className="btn btn-outline-danger rounded-pill w-100 d-flex align-items-center justify-content-center"
                            onClick={() => handleCancelar(turno._id, turno.negocioId?.name)}
                          >
                            <FaCalendarTimes className="me-2" /> Cancelar turno
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisTurnos

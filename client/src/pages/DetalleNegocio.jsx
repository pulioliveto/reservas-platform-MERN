import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { getBusinessById } from "../services/apiBusiness"
import { reservarTurno } from "../services/apiReservation"
import BackButton from "../components/BackButton"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import ReservaModal from "../components/ReservaModal"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getAuth } from "firebase/auth"
import AgendaTab from "../components/AgendaTab"
import ContactoTab from "../components/ContactoTab"
import ClientesTab from "../components/ClientesTab"
import EditarContacto from "../components/EditarContacto"
import { FaPen, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaUsers, FaInfoCircle } from "react-icons/fa"
import PersonalTab from "../components/PersonalTab"; // Asegurate que el nombre coincida con tu archivo

const DetalleNegocio = () => {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reservedSlots, setReservedSlots] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const [reservas, setReservas] = useState([])
  const [loadingReservas, setLoadingReservas] = useState(false)
  const [errorReservas, setErrorReservas] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("agenda")
  const [editandoContacto, setEditandoContacto] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [empleados, setEmpleados] = useState([]);

  // Mapeo de días con todas las variantes posibles
  const DAYS_MAP = [
    { id: 0, names: ["domingo"] },
    { id: 1, names: ["lunes"] },
    { id: 2, names: ["martes"] },
    { id: 3, names: ["miércoles", "miercoles"] },
    { id: 4, names: ["jueves"] },
    { id: 5, names: ["viernes"] },
    { id: 6, names: ["sábado", "sabado"] },
  ]

  // Normalizar nombres de días para comparación
  const normalizeDayName = (dayName) => {
    return dayName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("á", "a")
      .replace("é", "e")
      .replace("í", "i")
      .replace("ó", "o")
      .replace("ú", "u")
  }

  // Generar slots según la duración configurada
  const generateSlots = (intervals) => {
    const slots = []
    const duration = business?.turnoDuration ? Number(business.turnoDuration) : 30 // minutos
    intervals.forEach(({ startTime, endTime }) => {
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)
      let current = new Date(0, 0, 0, startHour, startMinute)
      const end = new Date(0, 0, 0, endHour, endMinute)
      while (current < end) {
        const timeStr = `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(
          2,
          "0",
        )}`
        slots.push({
          time: timeStr,
          available: true,
          startTime: timeStr,
          endTime: "", // No se usa
        })
        current = new Date(current.getTime() + duration * 60000)
      }
    })
    return slots
  }

  // Obtener el horario para un día específico
  const getDaySchedule = (date) => {
    if (!business?.schedule) return null

    const dayOfWeek = date.getDay()
    const dayInfo = DAYS_MAP.find((d) => d.id === dayOfWeek)
    if (!dayInfo) return null

    return business.schedule.find((item) => {
      const storedDay = normalizeDayName(item.day)
      return dayInfo.names.some((name) => normalizeDayName(name) === storedDay)
    })
  }

  // Cargar datos del negocio
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getBusinessById(id)
        console.log("Datos del negocio recibidos:", data)
        setBusiness(data)

        // Seleccionar automáticamente el primer día abierto
        const today = new Date()
        let dayToSelect = today
        let attempts = 0

        while (attempts < 7) {
          const schedule = getDaySchedule(dayToSelect)
          if (schedule?.intervals?.length > 0) {
            setSelectedDay(dayToSelect)
            break
          }
          dayToSelect = addDays(dayToSelect, 1)
          attempts++
        }
      } catch (error) {
        console.error("Error al obtener el negocio:", error)
        toast.error("Error al cargar los datos del negocio")
      }
    }

    fetchBusiness()
  }, [id])

  // Consultar turnos ocupados para el negocio y fecha seleccionada
  const fetchReservedSlots = useCallback(async (negocioId, fecha) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/${negocioId}?fecha=${fecha}`)
      if (response.ok) {
        const data = await response.json()
        setReservedSlots(data.map((r) => r.turno))
      } else {
        setReservedSlots([])
      }
    } catch (error) {
      setReservedSlots([])
    }
  }, [])

  // Actualizar slots disponibles y turnos ocupados cuando cambia el día seleccionado
  useEffect(() => {
    if (selectedDay && business) {
      const daySchedule = getDaySchedule(selectedDay)
      if (daySchedule?.intervals?.length > 0) {
        const slots = generateSlots(daySchedule.intervals)
        setAvailableSlots(slots)
        // Consultar turnos ocupados para ese día
        const fechaStr = format(selectedDay, "yyyy-MM-dd")
        fetchReservedSlots(business._id, fechaStr)
      } else {
        setAvailableSlots([])
        setReservedSlots([])
      }
    }
  }, [selectedDay, business, fetchReservedSlots])

  // Verificar si el usuario autenticado es el creador del negocio
  useEffect(() => {
    const checkOwner = async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (user && business && business.createdBy === user.uid) {
        setIsOwner(true)
      } else {
        setIsOwner(false)
      }
    }
    checkOwner()
  }, [business])

  // Obtener reservas del negocio si es el dueño
  useEffect(() => {
    const fetchReservas = async () => {
      if (!isOwner || !business) return
      setLoadingReservas(true)
      setErrorReservas("")
      try {
        const auth = getAuth()
        const user = auth.currentUser
        const token = user ? await user.getIdToken() : null
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/${business._id}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("No se pudieron obtener las reservas")
        const data = await response.json()
        setReservas(data)
      } catch (err) {
        setErrorReservas("Error al cargar las reservas")
      } finally {
        setLoadingReservas(false)
      }
    }
    fetchReservas()
  }, [isOwner, business])

  const fetchEmpleados = useCallback(async () => {
    if (!business?._id) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/empleados/${business._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return setEmpleados([]);
      const data = await res.json();
      setEmpleados(data);
    } catch {
      setEmpleados([]);
    }
  }, [business]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  // Cambia la pestaña activa según el query param 'tab'
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get("tab")
    if (tabParam && (tabParam === "agenda" || tabParam === "contacto" || tabParam === "clientes")) {
      setActiveTab(tabParam)
    } else {
      setActiveTab("agenda")
    }
  }, [location.search, isOwner])

  // Manejar selección de slot
  const handleSlotSelection = (slot) => {
    if (!slot.available) {
      toast.error("Este turno ya está reservado")
      return
    }
    setSelectedSlot(slot)
    setShowModal(true)
  }

  const auth = getAuth()
  const user = auth.currentUser;

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedSlot(null)
  }

  // Confirmar reserva
  const handleReservationConfirm = async ({dni, telefono, email, selectedSlot, empleadoId}) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        toast.error("Debes iniciar sesión para reservar.")
        return
      }
      await reservarTurno({
        negocioId: business._id,
        turno: selectedSlot.time,
        fecha: format(selectedDay, "yyyy-MM-dd"),
        dni,
        telefono,
        email,
        empleadoId, // <-- nuevo campo
      })

      // Actualizar disponibilidad del slot
      setAvailableSlots((prevSlots) =>
        prevSlots.map((s) => (s.time === selectedSlot.time ? { ...s, available: false } : s)),
      )
      toast.success("Turno reservado")
      closeModal()
      setTimeout(() => {
        navigate("/mis-turnos")
      }, 1200)
    } catch (error) {
      console.error("Error en la reserva:", error)
      toast.error(error.message || "Error al realizar la reserva")
    }
  }

  // Guardar cambios de contacto
  const handleSaveContacto = async (formData) => {
    setEditLoading(true)
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/businesses/${business._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: (() => {
          const fd = new FormData()
          Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
          return fd
        })(),
      })
      if (!response.ok) throw new Error("Error al guardar los cambios")
      const updated = await response.json()
      setBusiness((prev) => ({ ...prev, ...updated }))
      setEditandoContacto(false)
      toast.success("Contacto actualizado")
    } catch (err) {
      toast.error("Error al guardar los cambios")
    } finally {
      setEditLoading(false)
    }
  }

  // Renderizar información del día
  const renderDayInfo = () => {
    if (!selectedDay || !business) return null

    const daySchedule = getDaySchedule(selectedDay)
    const isClosed = !daySchedule?.intervals?.length
    const dayName = format(selectedDay, "EEEE", { locale: es })

    if (isClosed) {
      return (
        <div className="alert alert-warning mt-4">
          <div className="d-flex align-items-center">
            <FaInfoCircle className="me-2" size={20} />
            <div>
              <strong>¡CERRADO!</strong> El negocio no abre los {dayName}.
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        <h4 className="mt-4 mb-4 fw-bold text-primary">
          Horarios disponibles para {dayName} {format(selectedDay, "dd/MM/yyyy", { locale: es })}
        </h4>
        {availableSlots.length > 0 ? (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
            {availableSlots.map((slot, index) => {
              const ocupado = reservedSlots.includes(slot.time)
              return (
                <div key={index} className="col">
                  <button
                    onClick={() => handleSlotSelection(slot)}
                    className={`btn w-100 time-slot-btn ${ocupado ? "time-slot-occupied" : "time-slot-available"}`}
                    disabled={ocupado}
                  >
                    {slot.time}
                    {ocupado && <span className="ms-2 small">(Ocupado)</span>}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <FaInfoCircle className="me-2" size={20} />
              <div>No hay turnos disponibles para este día.</div>
            </div>
          </div>
        )}
      </>
    )
  }

  if (!business) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando información del negocio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="d-flex align-items-center mb-4">
          <BackButton className="me-3" />
          <h2 className="mb-0 fw-bold text-primary">Detalle del Negocio</h2>
        </div>

        <div className="card border-0 shadow-sm mb-4 overflow-hidden">
          <div className="card-body p-0">
            <div className="row g-0">
              {business.logo && (
                <div className="col-md-3 business-logo-container">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${business.logo}`}
                    alt="Logo"
                    className="business-logo"
                  />
                </div>
              )}
              <div className={`col-md-${business.logo ? "9" : "12"}`}>
                <div className="p-4">
                  <h2 className="card-title fw-bold mb-2">{business.name}</h2>
                  <p className="card-text text-muted mb-3">{business.description}</p>
                  <div className="d-flex flex-wrap">
                    {business.address && (
                      <div className="me-4 mb-2 d-flex align-items-center">
                        <FaMapMarkerAlt className="text-primary me-2" />
                        <span>{business.address}</span>
                      </div>
                    )}
                    {business.phone && (
                      <div className="me-4 mb-2 d-flex align-items-center">
                        <FaPhone className="text-primary me-2" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom-0 p-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "agenda" ? "active" : ""}`}
                  onClick={() => setActiveTab("agenda")}
                >
                  <FaCalendarAlt className="me-2" />
                  Agenda
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "contacto" ? "active" : ""}`}
                  onClick={() => setActiveTab("contacto")}
                >
                  <FaInfoCircle className="me-2" />
                  Contacto
                </button>
              </li>
              {isOwner && (
                <>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "clientes" ? "active" : ""}`}
                      onClick={() => setActiveTab("clientes")}
                    >
                      <FaUsers className="me-2" />
                      Clientes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                      onClick={() => setActiveTab("personal")}
                    >
                      <FaUsers className="me-2" />
                      Personal
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="card-body p-4">
            {activeTab === "agenda" && (
              <AgendaTab
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                getDaySchedule={getDaySchedule}
                renderDayInfo={renderDayInfo}
              />
            )}

            {activeTab === "contacto" && (
              <div>
                {isOwner && (
                  <div className="d-flex justify-content-end mb-3">
                    {!editandoContacto ? (
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => setEditandoContacto(true)}
                      >
                        <FaPen className="me-2" /> Editar información
                      </button>
                    ) : null}
                  </div>
                )}

                {isOwner && editandoContacto ? (
                  <EditarContacto
                    business={business}
                    onSave={handleSaveContacto}
                    onCancel={() => setEditandoContacto(false)}
                    loading={editLoading}
                  />
                ) : (
                  <ContactoTab business={business} />
                )}
              </div>
            )}

            {activeTab === "clientes" && isOwner && (
              <ClientesTab loadingReservas={loadingReservas} errorReservas={errorReservas} reservas={reservas} />
            )}

            {activeTab === "personal" && isOwner && (
              <PersonalTab negocioId={business._id} onEmpleadosChange={fetchEmpleados} />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ReservaModal
          show={showModal}
          onHide={closeModal}
          selectedDay={selectedDay}
          selectedSlot={selectedSlot}
          business={business}
          onConfirm={handleReservationConfirm}
          user={user}
          empleados={empleados} // <-- pasa la lista de empleados
        />
      )}
    </div>
  )
}

export default DetalleNegocio

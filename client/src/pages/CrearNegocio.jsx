import { useState, useContext } from "react"
import { Container, Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { createBusiness } from "../services/apiBusiness"
import { AuthContext } from "../context/AuthContext"
import { getAccessToken } from "../services/googleCalendarService"
import CalendarioTurno from "../components/CalendarioTurno"
import { useNavigate } from "react-router-dom"
import BusinessForm from "../components/BusinessForm"
import LogoPreview from "../components/LogoPreview"

const CrearNegocio = () => {
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
    logo: null,
    schedule: [],
    turnoDuration: 30,
  })
  const [message, setMessage] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)
  const [scheduleError, setScheduleError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "logo" && files && files[0]) {
      const file = files[0]
      setFormData({
        ...formData,
        [name]: file,
      })
      setPreviewUrl(URL.createObjectURL(file))
    } else if (name === "turnoDuration") {
      setFormData({
        ...formData,
        [name]: Number(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone: phone ? phone.toString() : "" }))
  }

  const handleScheduleChange = (newSchedule) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      schedule: newSchedule,
    }))
    setScheduleError("")
  }

  const validateSchedule = (schedule) => {
    if (schedule.length === 0) {
      return "Por favor, agrega los horarios para al menos un día de la semana."
    }

    const openDays = schedule.filter((day) => day.isOpen)

    if (openDays.length === 0) {
      return "El negocio debe tener horarios definidos para al menos un día de la semana."
    }

    const hasInvalidIntervals = openDays.some((day) => {
      if (day.intervals && day.intervals.length > 0) {
        return day.intervals.some((interval) => {
          if (!interval.startTime || !interval.endTime) {
            return true
          }
          if (interval.startTime >= interval.endTime) {
            return true
          }
          return false
        })
      }
      return true
    })

    if (hasInvalidIntervals) {
      return "Por favor, completa correctamente los horarios para los días que el negocio está abierto (hora de inicio debe ser menor que hora de cierre)."
    }

    return ""
  }

  const validateStep1 = () => {
    return formData.name && formData.description && formData.address && formData.phone
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      setMessage("Por favor, completa todos los campos obligatorios.")
      return
    }
    setMessage("")
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const scheduleValidationError = validateSchedule(formData.schedule)
    if (scheduleValidationError) {
      setScheduleError(scheduleValidationError)
      setIsSubmitting(false)
      return
    }

    try {
      const token = await getAccessToken()
      await createBusiness(formData, token)
      setMessage("¡Negocio creado correctamente! Redirigiendo...")
      setTimeout(() => {
        navigate("/tu-perfil")
      }, 1500)
    } catch (error) {
      console.error("Error al crear el negocio:", error)
      setMessage(error.message || "Error al crear el negocio")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="d-flex align-items-center mb-4">
              {/* <BackButton className="me-3" /> */}
              <h2 className="mb-0 fw-bold text-primary">Crear Negocio</h2>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                <div className="position-relative mb-0">
                  <div className="progress" style={{ height: "2px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${currentStep === 1 ? "50%" : "100%"}` }}
                      aria-valuenow={currentStep === 1 ? 50 : 100}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="position-absolute top-0 start-0 translate-middle-y d-flex justify-content-between w-100 px-3">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-light text-muted"}`}
                        style={{ width: "32px", height: "32px" }}
                      >
                        1
                      </div>
                      <span className="small mt-1">Información</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-light text-muted"}`}
                        style={{ width: "32px", height: "32px" }}
                      >
                        2
                      </div>
                      <span className="small mt-1">Horarios</span>
                    </div>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-4 pt-5">
                {message && (
                  <Alert
                    variant={message.includes("Error") ? "danger" : "success"}
                    className="animate__animated animate__fadeIn"
                  >
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="animate__animated animate__fadeIn">
                      <p className="text-muted mb-4">
                        Completa la información básica de tu negocio para comenzar a recibir reservas.
                      </p>
                      <Row>
                        <Col md={8}>
                          <BusinessForm
                            formData={formData}
                            handleChange={handleChange}
                            handlePhoneChange={handlePhoneChange}
                          />
                        </Col>
                        <Col md={4}>
                          <LogoPreview logo={formData.logo} previewUrl={previewUrl} handleLogoChange={handleChange} />
                        </Col>
                      </Row>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="animate__animated animate__fadeIn">
                      <CalendarioTurno onScheduleChange={handleScheduleChange} />
                      {scheduleError && (
                        <Alert variant="danger" className="mt-3">
                          {scheduleError}
                        </Alert>
                      )}
                      <div className="mt-3 text-muted small">
                        <p>Nota: Puedes dejar sin horarios los días que el negocio permanezca cerrado.</p>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    {currentStep > 1 && (
                      <Button variant="outline-secondary" onClick={prevStep} className="px-4">
                        Anterior
                      </Button>
                    )}

                    <div className="ms-auto">
                      {currentStep < 2 ? (
                        <Button variant="primary" onClick={nextStep} className="px-4">
                          Siguiente
                        </Button>
                      ) : (
                        <Button type="submit" variant="primary" className="px-4" disabled={isSubmitting}>
                          {isSubmitting ? "Creando..." : "Crear Negocio"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CrearNegocio

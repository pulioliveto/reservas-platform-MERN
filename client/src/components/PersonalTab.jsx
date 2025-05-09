import { useEffect, useState } from "react"
import { Button, Form, Table, Modal, InputGroup, Alert, Spinner } from "react-bootstrap"
import { getAuth } from "firebase/auth"
import {
  FaUserTie,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaTrashAlt,
  FaExclamationTriangle,
  FaSearch,
  FaTimes,
} from "react-icons/fa"
import "../css/PersonalTab.css"

const API_URL = process.env.REACT_APP_API_URL

const PersonalTab = ({ negocioId, onEmpleadosChange }) => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Obtener empleados del negocio
  const fetchEmpleados = async () => {
    setLoading(true)
    setError("")
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/api/empleados/${negocioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("No se pudieron obtener los empleados")
      const data = await res.json()
      setEmpleados(data)
    } catch (err) {
      setError("Error al cargar empleados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (negocioId) fetchEmpleados()
  }, [negocioId])

  // Agregar empleado
  const handleAddEmpleado = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    setIsSubmitting(true)

    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/api/empleados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, negocioId }),
      })

      if (!res.ok) throw new Error("No se pudo agregar el empleado")

      setForm({ nombre: "", email: "", telefono: "" })
      setShowModal(false)
      setSuccess("Empleado agregado correctamente")
      fetchEmpleados()
      if (onEmpleadosChange) onEmpleadosChange()

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Error al agregar empleado")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar empleado
  const handleDelete = async (id) => {
    setConfirmDelete(null)
    setError("")
    setSuccess("")

    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/api/empleados/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("No se pudo eliminar el empleado")

      setSuccess("Empleado eliminado correctamente")
      fetchEmpleados()
      if (onEmpleadosChange) onEmpleadosChange()

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Error al eliminar empleado")
    }
  }

  // Filtrar empleados según término de búsqueda
  const filteredEmpleados = empleados.filter(
    (emp) =>
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.telefono && emp.telefono.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="personal-tab">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h5 className="fw-bold mb-3 mb-md-0 d-flex align-items-center">
          <FaUserTie className="me-2 text-primary" /> Personal del Negocio
        </h5>
        <div className="d-flex gap-2 align-items-center">
          <div className="search-container">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0 ps-0"
              />
              {searchTerm && (
                <InputGroup.Text className="bg-white border-start-0 pe-3">
                  <Button
                    variant="link"
                    className="p-0 text-muted"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <FaTimes />
                  </Button>
                </InputGroup.Text>
              )}
            </InputGroup>
          </div>
          <Button variant="primary" className="add-employee-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Agregar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center animate__animated animate__fadeIn">
          <FaExclamationTriangle className="me-2" /> {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="d-flex align-items-center animate__animated animate__fadeIn">
          <FaPlus className="me-2" /> {success}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando empleados...</p>
        </div>
      ) : empleados.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-icon mb-3">
            <FaUserTie size={48} className="text-muted opacity-25" />
          </div>
          <h5>No hay empleados registrados</h5>
          <p className="text-muted">
            Agrega empleados a tu negocio para asignarles turnos y gestionar mejor tu agenda.
          </p>
        </div>
      ) : filteredEmpleados.length === 0 ? (
        <div className="text-center py-4">
          <div className="empty-search-icon mb-3">
            <FaSearch size={32} className="text-muted opacity-25" />
          </div>
          <p className="text-muted">No se encontraron empleados con el término "{searchTerm}"</p>
          <Button variant="link" onClick={() => setSearchTerm("")}>
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <Table className="employee-table align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.map((emp) => (
                <tr key={emp._id} className="employee-row">
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="employee-avatar">
                        <FaUser />
                      </div>
                      <div className="ms-3 fw-medium">{emp.nombre}</div>
                    </div>
                  </td>
                  <td>
                    {emp.email ? (
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="text-muted me-2" size={14} />
                        <span>{emp.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {emp.telefono ? (
                      <div className="d-flex align-items-center">
                        <FaPhone className="text-muted me-2" size={14} />
                        <span>{emp.telefono}</span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-end">
                    {confirmDelete === emp._id ? (
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setConfirmDelete(null)}
                          className="btn-cancel"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(emp._id)}
                          className="btn-confirm-delete"
                        >
                          Confirmar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setConfirmDelete(emp._id)}
                        className="btn-delete"
                      >
                        <FaTrashAlt className="me-1" /> Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal para agregar empleado */}
      <Modal show={showModal} onHide={() => !isSubmitting && setShowModal(false)} centered className="employee-modal">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <div className="modal-icon me-2">
              <FaUserTie />
            </div>
            Agregar Empleado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEmpleado}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaUser className="text-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Nombre completo"
                  required
                  className="border-start-0 ps-0"
                  disabled={isSubmitting}
                />
              </InputGroup>
              <Form.Text className="text-muted">El nombre es obligatorio</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email (opcional)</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaEnvelope className="text-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="border-start-0 ps-0"
                  disabled={isSubmitting}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Teléfono (opcional)</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaPhone className="text-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+54 9 11 1234-5678"
                  className="border-start-0 ps-0"
                  disabled={isSubmitting}
                />
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => !isSubmitting && setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" /> Agregar Empleado
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PersonalTab

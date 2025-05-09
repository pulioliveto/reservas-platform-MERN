"use client"

import { useState, useMemo } from "react"
import { Modal, Button, Form, InputGroup, Table, Badge, Spinner } from "react-bootstrap"
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserClock,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaHistory,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaTimes,
} from "react-icons/fa"
import "../css/ClientesTab.css"

const ClientesTab = ({ loadingReservas, errorReservas, reservas }) => {
  const [search, setSearch] = useState("")
  const [order, setOrder] = useState("desc") // 'desc' = más recientes primero
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredReservas = useMemo(() => {
    let res = reservas
    if (search.trim() !== "") {
      const s = search.trim().toLowerCase()
      res = res.filter(
        (r) =>
          (r.clienteNombre || "").toLowerCase().includes(s) ||
          (r.email || "").toLowerCase().includes(s) ||
          (r.dni || "").toLowerCase().includes(s) ||
          (r.telefono || "").toLowerCase().includes(s),
      )
    }
    res = [...res].sort((a, b) => {
      const dateA = new Date(a.fecha)
      const dateB = new Date(b.fecha)
      return order === "desc" ? dateB - dateA : dateA - dateB
    })
    return res
  }, [reservas, search, order])

  const toggleOrder = () => setOrder(order === "desc" ? "asc" : "desc")

  // Historial de turnos del cliente seleccionado
  const historial = useMemo(() => {
    if (!selectedCliente) return []
    return reservas.filter(
      (r) =>
        (selectedCliente.clienteId && r.clienteId === selectedCliente.clienteId) ||
        (selectedCliente.email && r.email === selectedCliente.email),
    )
  }, [selectedCliente, reservas])

  return (
    <div className="clientes-tab">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h5 className="fw-bold mb-3 mb-md-0 d-flex align-items-center">
          <FaUserClock className="me-2 text-primary" /> Clientes y Reservas
        </h5>
        <div className="search-container">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar cliente"
              className="border-start-0 ps-0"
            />
            {search && (
              <InputGroup.Text className="bg-white border-start-0 pe-3">
                <Button
                  variant="link"
                  className="p-0 text-muted"
                  onClick={() => setSearch("")}
                  aria-label="Limpiar búsqueda"
                >
                  <FaTimes />
                </Button>
              </InputGroup.Text>
            )}
          </InputGroup>
        </div>
      </div>

      {loadingReservas ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando reservas...</p>
        </div>
      ) : errorReservas ? (
        <div className="alert alert-danger d-flex align-items-center">
          <FaSearch className="me-2 flex-shrink-0" />
          <div>{errorReservas}</div>
        </div>
      ) : filteredReservas.length === 0 ? (
        <div className="text-center py-5">
          <div className="empty-results-icon mb-3">
            <FaUserClock size={48} className="text-muted opacity-25" />
          </div>
          <h5>No hay reservas registradas</h5>
          <p className="text-muted">Cuando los clientes realicen reservas, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="clientes-table">
            <thead className="table-light">
              <tr>
                <th>Nombre del Cliente</th>
                <th>Empleado</th>
                <th style={{ cursor: "pointer", userSelect: "none" }} onClick={toggleOrder} className="sortable-header">
                  <div className="d-flex align-items-center">
                    Fecha
                    {order === "desc" ? (
                      <FaSortDown className="ms-1" />
                    ) : order === "asc" ? (
                      <FaSortUp className="ms-1" />
                    ) : (
                      <FaSort className="ms-1" />
                    )}
                  </div>
                </th>
                <th>Turno</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((r) => (
                <tr
                  key={r._id}
                  className="cliente-row"
                  onClick={() => {
                    setSelectedCliente(r)
                    setShowModal(true)
                  }}
                >
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="cliente-avatar">
                        <FaUser />
                      </div>
                      <div className="ms-2 fw-medium">{r.clienteNombre || "-"}</div>
                    </div>
                  </td>
                  <td>
                    {r.empleadoNombre ? (
                      <div className="d-flex align-items-center">
                        <div className="empleado-badge">
                          <FaUserTie size={12} />
                        </div>
                        <span className="ms-1">{r.empleadoNombre}</span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="fecha-badge">
                      <FaCalendarAlt className="me-1" size={12} />
                      {new Date(r.fecha).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="turno-badge">
                      <FaClock className="me-1" size={12} />
                      {r.turno}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal de información del cliente */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="cliente-modal">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <div className="modal-icon me-2">
              <FaUser />
            </div>
            Información del Cliente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente && (
            <div className="cliente-info">
              <div className="info-section">
                <h6 className="section-title">Datos personales</h6>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <FaUser />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Nombre</div>
                      <div className="info-value">
                        {selectedCliente.user?.name || selectedCliente.clienteNombre || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaIdCard />
                    </div>
                    <div className="info-content">
                      <div className="info-label">DNI</div>
                      <div className="info-value">{selectedCliente.dni || "-"}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaEnvelope />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Email</div>
                      <div className="info-value">{selectedCliente.email || "-"}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaPhone />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Teléfono</div>
                      <div className="info-value">{selectedCliente.telefono || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h6 className="section-title d-flex align-items-center">
                  <FaHistory className="me-2" />
                  Historial de turnos
                </h6>
                {historial.length === 0 ? (
                  <p className="text-muted">Sin historial de turnos.</p>
                ) : (
                  <div className="historial-list">
                    {historial.map((h) => (
                      <div key={h._id} className="historial-item">
                        <div className="historial-fecha">
                          <FaCalendarAlt className="me-1" size={12} />
                          {new Date(h.fecha).toLocaleDateString()}
                        </div>
                        <div className="historial-hora">
                          <FaClock className="me-1" size={12} />
                          {h.turno}
                        </div>
                        {h.empleadoNombre && (
                          <Badge bg="light" text="dark" className="historial-empleado">
                            <FaUserTie className="me-1" size={10} />
                            {h.empleadoNombre}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientesTab

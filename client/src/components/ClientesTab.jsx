import { useState, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaUserClock } from "react-icons/fa";

const ClientesTab = ({ loadingReservas, errorReservas, reservas }) => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc"); // 'desc' = más recientes primero
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredReservas = useMemo(() => {
    let res = reservas;
    if (search.trim() !== "") {
      const s = search.trim().toLowerCase();
      res = res.filter((r) => (r.clienteNombre || "").toLowerCase().includes(s));
    }
    res = [...res].sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
    return res;
  }, [reservas, search, order]);

  const toggleOrder = () => setOrder(order === "desc" ? "asc" : "desc");

  // Historial de turnos del cliente seleccionado
  const historial = useMemo(() => {
    if (!selectedCliente) return [];
    return reservas.filter(
      (r) =>
        (selectedCliente.clienteId && r.clienteId === selectedCliente.clienteId) ||
        (selectedCliente.email && r.email === selectedCliente.email)
    );
  }, [selectedCliente, reservas]);

  return (
    <div className="w-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h5 className="fw-bold mb-3 mb-md-0 d-flex align-items-center">
          <FaUserClock className="me-2 text-primary" /> Clientes y Reservas
        </h5>
        <div className="search-container">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar cliente"
            />
          </div>
        </div>
      </div>

      {loadingReservas ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando reservas...</p>
        </div>
      ) : errorReservas ? (
        <div className="alert alert-danger">
          <FaSearch className="me-2" />
          {errorReservas}
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
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Nombre del Cliente</th>
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
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedCliente(r);
                    setShowModal(true);
                  }}
                >
                  <td>{r.user?.name || r.clienteNombre || r.clienteId || "-"}</td>
                  <td>{new Date(r.fecha).toLocaleDateString()}</td>
                  <td>{r.turno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de información del cliente */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente && (
            <>
              <p><strong>Nombre:</strong> {selectedCliente.user?.name || selectedCliente.clienteNombre || "-"}</p>
              <p><strong>DNI:</strong> {selectedCliente.dni || "-"}</p>
              <p><strong>Correo electrónico:</strong> {selectedCliente.email || "-"}</p>
              <p><strong>Teléfono:</strong> {selectedCliente.telefono || "-"}</p>
              <hr />
              <h6>Historial de turnos:</h6>
              {historial.length === 0 ? (
                <p className="text-muted">Sin historial de turnos.</p>
              ) : (
                <ul className="list-unstyled">
                  {historial.map((h) => (
                    <li key={h._id} className="mb-2">
                      <span className="badge bg-primary me-2">{new Date(h.fecha).toLocaleDateString()}</span>
                      <span>Turno: <strong>{h.turno}</strong></span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientesTab;

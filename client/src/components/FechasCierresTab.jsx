"use client"

import { useState, useEffect } from "react"
import { Button, Form, Spinner, Badge } from "react-bootstrap"
import { getAuth } from "firebase/auth"
import {
  FaTrash,
  FaCalendarAlt,
  FaCalendarPlus,
  FaCalendarTimes,
  FaExclamationTriangle,
  FaPlus,
  FaCalendarDay,
  FaCalendarWeek,
} from "react-icons/fa"
import "../css/FechasCierresTab.css"

const API_URL = process.env.REACT_APP_API_URL

const FechasCierresTab = ({ negocioId, onFechasChange }) => {
  const [fechas, setFechas] = useState([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [rangoActivo, setRangoActivo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agregando, setAgregando] = useState(false)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Traer fechas de cierre al montar
  useEffect(() => {
    const fetchFechas = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_URL}/api/businesses/${negocioId}`)
        const data = await res.json()
        setFechas(Array.isArray(data) ? data : data.specialClosedDates || [])
        if (onFechasChange) onFechasChange(Array.isArray(data) ? data : data.specialClosedDates || [])
      } catch {
        setError("Error al cargar las fechas de cierre")
      } finally {
        setLoading(false)
      }
    }
    if (negocioId) fetchFechas()
    // eslint-disable-next-line
  }, [negocioId])

  // Generar array de fechas entre inicio y fin
  const getFechasRango = (inicio, fin) => {
    const fechas = []
    const current = new Date(inicio)
    const end = new Date(fin)
    while (current <= end) {
      fechas.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return fechas
  }

  // Agregar fecha(s) de cierre
  const handleAgregar = async (e) => {
    e.preventDefault()
    if (!fechaInicio || (rangoActivo && !fechaFin)) return
    setAgregando(true)
    setError("")
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      let fechasRango = []
      if (rangoActivo) {
        fechasRango = getFechasRango(fechaInicio, fechaFin)
      } else {
        fechasRango = [new Date(fechaInicio)]
      }
      const res = await fetch(`${API_URL}/api/businesses/${negocioId}/fechas-cierre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fechas: fechasRango }),
      })
      const data = await res.json()
      setFechas(data)
      setFechaInicio("")
      setFechaFin("")
      if (onFechasChange) onFechasChange(data)
    } catch {
      setError("Error al agregar las fechas")
    } finally {
      setAgregando(false)
    }
  }

  // Eliminar fecha de cierre
  const handleEliminar = async (fecha) => {
    setLoading(true)
    setError("")
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/api/businesses/${negocioId}/fechas-cierre`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha }),
      })
      const data = await res.json()
      setFechas(data)
      if (onFechasChange) onFechasChange(data)
    } catch {
      setError("Error al eliminar la fecha")
    } finally {
      setLoading(false)
      setConfirmDelete(null)
    }
  }

  // Eliminar múltiples fechas a la vez
  const handleBulkDelete = async () => {
    if (selectedDates.length === 0) return

    setLoading(true)
    setError("")
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null

      // Crear un array de promesas para eliminar cada fecha
      const deletePromises = selectedDates.map((fecha) =>
        fetch(`${API_URL}/api/businesses/${negocioId}/fechas-cierre`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fecha }),
        }),
      )

      // Esperar a que todas las eliminaciones se completen
      await Promise.all(deletePromises)

      // Actualizar el estado
      const updatedFechas = fechas.filter((fecha) => !selectedDates.includes(fecha))
      setFechas(updatedFechas)
      if (onFechasChange) onFechasChange(updatedFechas)
      setSelectedDates([])
    } catch {
      setError("Error al eliminar las fechas seleccionadas")
    } finally {
      setLoading(false)
      setBulkDeleteConfirm(false)
    }
  }

  // Manejar selección de una fecha
  const handleSelectDate = (fecha) => {
    if (selectedDates.includes(fecha)) {
      setSelectedDates(selectedDates.filter((d) => d !== fecha))
    } else {
      setSelectedDates([...selectedDates, fecha])
    }
  }

  // Seleccionar todas las fechas
  const handleSelectAll = () => {
    if (selectedDates.length === fechas.length) {
      setSelectedDates([])
    } else {
      setSelectedDates([...fechas])
    }
  }

  // Seleccionar todas las fechas de un mes
  const handleSelectMonth = (fechasMes) => {
    // Si todas las fechas del mes están seleccionadas, deseleccionarlas
    const allSelected = fechasMes.every((fecha) => selectedDates.includes(fecha))

    if (allSelected) {
      setSelectedDates(selectedDates.filter((fecha) => !fechasMes.includes(fecha)))
    } else {
      // Combinar las fechas seleccionadas existentes con las nuevas
      const newSelection = [...selectedDates]
      fechasMes.forEach((fecha) => {
        if (!newSelection.includes(fecha)) {
          newSelection.push(fecha)
        }
      })
      setSelectedDates(newSelection)
    }
  }

  // Agrupar fechas por mes para mejor visualización
  const fechasAgrupadas = fechas.reduce((acc, fecha) => {
    const fechaObj = new Date(fecha)
    const mes = fechaObj.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    if (!acc[mes]) {
      acc[mes] = []
    }
    acc[mes].push(fecha)
    return acc
  }, {})

  // Verificar si una fecha es hoy o futura
  const esFechaFutura = (fecha) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaObj = new Date(fecha)
    return fechaObj >= hoy
  }

  return (
    <div className="fechas-cierre-tab">
      <div className="fechas-header">
        <h5 className="fechas-header-title">
          <FaCalendarAlt className="fechas-header-icon" />
          Cierres especiales / Vacaciones
          {fechas.length > 0 && (
            <Badge className="fechas-badge fechas-badge-count" pill>
              {fechas.length}
            </Badge>
          )}
        </h5>
      </div>

      <div className="fechas-form-container fechas-fade-in">
        <Form onSubmit={handleAgregar} className="fechas-form">
          <Form.Group className="fechas-form-group">
            <Form.Label className="fechas-form-label">
              {rangoActivo ? (
                <>
                  <FaCalendarDay className="me-2" />
                  Desde
                </>
              ) : (
                <>
                  <FaCalendarDay className="me-2" />
                  Día de cierre
                </>
              )}
            </Form.Label>
            <Form.Control
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              max={rangoActivo ? fechaFin || undefined : undefined}
              className="fechas-date-input"
            />
          </Form.Group>

          {rangoActivo && (
            <Form.Group className="fechas-form-group">
              <Form.Label className="fechas-form-label">
                <FaCalendarDay className="me-2" />
                Hasta
              </Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
                min={fechaInicio || undefined}
                className="fechas-date-input"
              />
            </Form.Group>
          )}

          <div className="fechas-checkbox-container">
            <Form.Check
              type="switch"
              id="rango-switch"
              label={
                <span className="fechas-checkbox-label">
                  <FaCalendarWeek className="me-2" />
                  Cerrar varios días
                </span>
              }
              checked={rangoActivo}
              onChange={() => {
                setRangoActivo(!rangoActivo)
                setFechaFin("")
              }}
              className="fechas-checkbox"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={agregando || !fechaInicio || (rangoActivo && !fechaFin)}
            className="fechas-submit-btn"
          >
            {agregando ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Agregando...
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Agregar
              </>
            )}
          </Button>
        </Form>

        <div className="fechas-help-text">
          <FaCalendarPlus className="me-2" />
          {rangoActivo
            ? "Selecciona un rango de días para cerrar el negocio (por ejemplo, para vacaciones)."
            : "Selecciona un día específico para cerrar el negocio (por ejemplo, un feriado)."}
        </div>
      </div>

      {error && (
        <div className="fechas-error fechas-fade-in">
          <FaExclamationTriangle className="fechas-error-icon" />
          {error}
        </div>
      )}

      {loading && !agregando ? (
        <div className="fechas-loading fechas-fade-in">
          <Spinner animation="border" className="fechas-spinner" />
          <p>Cargando fechas de cierre...</p>
        </div>
      ) : fechas.length === 0 ? (
        <div className="fechas-empty-state fechas-fade-in">
          <FaCalendarTimes className="fechas-empty-icon" />
          <p>No hay fechas de cierre programadas.</p>
          <p className="text-muted">Agrega fechas en las que tu negocio permanecerá cerrado.</p>
        </div>
      ) : (
        <div className="fechas-table-container fechas-fade-in">
          {/* Acciones para selección múltiple */}
          {fechas.length > 0 && (
            <div className="fechas-bulk-actions">
              <div className="fechas-select-all">
                <Form.Check
                  type="checkbox"
                  id="select-all-checkbox"
                  checked={selectedDates.length === fechas.length && fechas.length > 0}
                  onChange={handleSelectAll}
                  label={
                    <span className="fechas-select-label">
                      {selectedDates.length === fechas.length && fechas.length > 0
                        ? "Deseleccionar todas"
                        : "Seleccionar todas"}
                    </span>
                  }
                />
              </div>

              {selectedDates.length > 0 && (
                <div className="fechas-bulk-delete">
                  {bulkDeleteConfirm ? (
                    <div className="fechas-confirm-actions">
                      <span className="fechas-confirm-text">
                        ¿Eliminar {selectedDates.length} fechas seleccionadas?
                      </span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setBulkDeleteConfirm(false)}
                        className="fechas-cancel-btn"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="fechas-confirm-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-1" />
                            Eliminando...
                          </>
                        ) : (
                          <>Confirmar</>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setBulkDeleteConfirm(true)}
                      className="fechas-delete-selected-btn"
                    >
                      <FaTrash className="me-2" />
                      Eliminar seleccionadas ({selectedDates.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {Object.entries(fechasAgrupadas).map(([mes, fechasMes]) => (
            <div key={mes} className="mb-4 fechas-month-group">
              <div className="fechas-month-header">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id={`select-month-${mes}`}
                    checked={fechasMes.every((fecha) => selectedDates.includes(fecha))}
                    onChange={() => handleSelectMonth(fechasMes)}
                    className="me-2"
                  />
                  <h6 className="mb-0">
                    <FaCalendarAlt className="me-2 text-primary" />
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                    <Badge className="fechas-badge" pill>
                      {fechasMes.length}
                    </Badge>
                  </h6>
                </div>
              </div>
              <table className="fechas-table">
                <thead>
                  <tr>
                    <th className="fechas-checkbox-column"></th>
                    <th>Fecha</th>
                    <th className="fechas-action-cell">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {fechasMes.map((f) => (
                    <tr key={f} className={esFechaFutura(f) ? "table-row-future" : "table-row-past"}>
                      <td className="fechas-checkbox-column">
                        <Form.Check
                          type="checkbox"
                          id={`check-${f}`}
                          checked={selectedDates.includes(f)}
                          onChange={() => handleSelectDate(f)}
                          className="fechas-date-checkbox"
                        />
                      </td>
                      <td className="fechas-date-cell">
                        {formatDate(f)}
                        {esFechaFutura(f) ? (
                          <Badge bg="primary" className="ms-2">
                            Próximo
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="ms-2">
                            Pasado
                          </Badge>
                        )}
                      </td>
                      <td className="fechas-action-cell">
                        {confirmDelete === f ? (
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setConfirmDelete(null)}
                              className="px-3"
                            >
                              Cancelar
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleEliminar(f)} className="px-3">
                              Confirmar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setConfirmDelete(f)}
                            className="fechas-delete-btn"
                            aria-label="Eliminar fecha"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FechasCierresTab

import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa"
import CalendarioDias from "./CalendarioDias"
import "../css/AgendaTab.css"

const AgendaTab = ({ selectedDay, setSelectedDay, getDaySchedule, renderDayInfo }) => {
  // Función para determinar el estado del día
  const getDayStatus = (date) => {
    const daySchedule = getDaySchedule(date)

    // Si no hay horarios o no hay intervalos, está cerrado
    if (!daySchedule || !daySchedule.intervals?.length) {
      return "cerrado"
    }

    // Verificar si hay información de turnos disponibles
    // Si no hay turnos disponibles o todos están ocupados
    if (daySchedule.turnosDisponibles === 0 || daySchedule.allOccupied === true) {
      return "ocupado"
    }

    // Si quedan pocos turnos (2 o menos)
    if (daySchedule.turnosDisponibles <= 2) {
      return "pocos"
    }

    // Por defecto, está abierto con turnos disponibles
    return "abierto"
  }

  return (
    <div className="agenda-tab">
      <div className="agenda-header">
        <h5 className="fw-bold d-flex align-items-center">
          <FaCalendarAlt className="me-2 text-primary" />
          Selecciona un día para ver los horarios disponibles
        </h5>
        <div className="agenda-info">
          <FaInfoCircle className="me-2 text-primary" />
          <span>Selecciona un día disponible para ver y reservar turnos</span>
        </div>
      </div>

      <div className="calendario-legend">
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-color legend-abierto"></span>
            <span className="legend-text">Disponible</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-pocos"></span>
            <span className="legend-text">Pocos turnos</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-cerrado"></span>
            <span className="legend-text">Cerrado</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-ocupado"></span>
            <span className="legend-text">Sin turnos</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <CalendarioDias onSelectDay={setSelectedDay} getDayStatus={getDayStatus} initialDate={selectedDay} />
      </div>

      <div className="horarios-container">{renderDayInfo()}</div>
    </div>
  )
}

export default AgendaTab

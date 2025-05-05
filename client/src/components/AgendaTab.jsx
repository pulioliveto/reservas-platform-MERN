import CalendarioDias from "./CalendarioDias"
import '../css/AgendaTab.css'

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
    <div className="w-100">
      <h5 className="fw-bold mb-4">Selecciona un día para ver los horarios disponibles</h5>

      <div className="calendario-legend mb-3">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
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

      <div className="calendar-container mb-4">
        <CalendarioDias onSelectDay={setSelectedDay} getDayStatus={getDayStatus} initialDate={selectedDay} />
      </div>

      {renderDayInfo()}
    </div>
  )
}

export default AgendaTab

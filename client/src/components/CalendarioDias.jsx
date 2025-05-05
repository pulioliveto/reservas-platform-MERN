import { useState, useEffect } from "react"
import { addDays, format, isBefore, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { FaLock, FaExclamationTriangle } from "react-icons/fa"
import "../css/CalendarioDias.css"

const CalendarioDias = ({ onSelectDay, getDayStatus, initialDate }) => {
  const today = startOfDay(new Date())
  const [startDay, setStartDay] = useState(today)
  const [selectedDay, setSelectedDay] = useState(initialDate ? initialDate.toDateString() : null)

  // Actualizar el día seleccionado cuando cambia initialDate
  useEffect(() => {
    if (initialDate) {
      setSelectedDay(initialDate.toDateString())
    }
  }, [initialDate])

  const getDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i)).filter((day) => !isBefore(day, today))
  }

  const handleNextWeek = () => setStartDay(addDays(startDay, 7))
  const handlePrevWeek = () => {
    const newStartDay = addDays(startDay, -7)
    if (!isBefore(newStartDay, today)) {
      setStartDay(newStartDay)
    }
  }

  // Determinar si el día es hoy
  const isToday = (day) => {
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  // Obtener la fecha actual formateada
  const currentDateFormatted = format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })

  return (
    <div className="calendario-dias">
      <div className="calendario-header">
        <button className="btn-calendar" onClick={handlePrevWeek}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="calendario-title-container">
          <h3 className="calendario-title">{format(startDay, "MMMM yyyy", { locale: es })}</h3>
          <p className="calendario-current-date">Hoy: {currentDateFormatted}</p>
        </div>
        <button className="btn-calendar" onClick={handleNextWeek}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      <div className="calendario-dias-grid">
        {getDays().map((day) => {
          const status = getDayStatus ? getDayStatus(day) : "abierto"
          const dayString = day.toDateString()
          const isSelected = selectedDay === dayString
          const isTodayDate = isToday(day)

          // Determinar las clases CSS según el estado
          let statusClass = ""
          let statusIcon = null

          if (status === "cerrado") {
            statusClass = "dia-cerrado"
            statusIcon = <FaLock className="status-icon" />
          } else if (status === "ocupado") {
            statusClass = "dia-ocupado"
            statusIcon = <FaExclamationTriangle className="status-icon" />
          } else if (status === "pocos") {
            statusClass = "dia-pocos"
            statusIcon = <FaExclamationTriangle className="status-icon" />
          } else {
            statusClass = "dia-abierto"
          }

          return (
            <div
              key={dayString}
              className={`dia ${statusClass} ${isSelected ? "selected" : ""} ${isTodayDate ? "today" : ""}`}
              onClick={() => {
                if (status !== "ocupado" && status !== "cerrado") {
                  setSelectedDay(dayString)
                  onSelectDay(day)
                }
              }}
            >
              <div className="dia-content">
                <p className="dia-nombre">{format(day, "EEE", { locale: es })}</p>
                <p className="dia-numero">{format(day, "d")}</p>
                {statusIcon && <div className="status-icon-container">{statusIcon}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarioDias

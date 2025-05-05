"use client"

import { useState, useEffect } from "react"
import { Button, Table, Form, Row, Col, Card } from "react-bootstrap"
import { FaPlus, FaTimes, FaClock } from "react-icons/fa"

const DIAS_SEMANA = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 0, nombre: "Domingo" },
]

const TimePicker10Min = ({ value, onChange, disabled }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = ["00", "10", "20", "30", "40", "50"]

  const handleHourChange = (e) => {
    const newHour = e.target.value.padStart(2, "0")
    const [_, currentMin] = value.split(":")
    onChange(`${newHour}:${currentMin || "00"}`)
  }

  const handleMinuteChange = (e) => {
    const newMin = e.target.value
    const [currentHour] = value.split(":")
    onChange(`${currentHour ? currentHour.padStart(2, "0") : "00"}:${newMin}`)
  }

  return (
    <div className="d-flex align-items-center">
      <Form.Select
        value={value ? value.split(":")[0].padStart(2, "0") : ""}
        onChange={handleHourChange}
        disabled={disabled}
        style={{ width: "70px" }}
        className="rounded-start rounded-0"
      >
        <option value="">HH</option>
        {hours.map((hour) => (
          <option key={hour} value={hour.toString().padStart(2, "0")}>
            {hour.toString().padStart(2, "0")}
          </option>
        ))}
      </Form.Select>
      <span className="mx-1 text-muted">:</span>
      <Form.Select
        value={value ? value.split(":")[1] : ""}
        onChange={handleMinuteChange}
        disabled={disabled}
        style={{ width: "70px" }}
        className="rounded-end rounded-0"
      >
        <option value="">MM</option>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </Form.Select>
    </div>
  )
}

const CalendarioTurno = ({ onScheduleChange, initialSchedule = [] }) => {
  const [schedule, setSchedule] = useState(
    initialSchedule.length > 0
      ? initialSchedule
      : DIAS_SEMANA.map((dia) => ({
          day: dia.id,
          dayName: dia.nombre,
          intervals: [{ startTime: "", endTime: "" }],
          isOpen: false,
        })),
  )

  useEffect(() => {
    if (initialSchedule.length > 0) {
      setSchedule(initialSchedule)
    }
  }, [initialSchedule])

  const handleTimeChange = (dayIndex, intervalIndex, field, value) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].intervals[intervalIndex][field] = value
    setSchedule(updatedSchedule)
    onScheduleChange(updatedSchedule)
  }

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" })
    setSchedule(updatedSchedule)
    onScheduleChange(updatedSchedule)
  }

  const removeInterval = (dayIndex, intervalIndex) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].intervals.splice(intervalIndex, 1)

    if (updatedSchedule[dayIndex].intervals.length === 0) {
      updatedSchedule[dayIndex].intervals = [{ startTime: "", endTime: "" }]
    }

    setSchedule(updatedSchedule)
    onScheduleChange(updatedSchedule)
  }

  const toggleDay = (dayIndex) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].isOpen = !updatedSchedule[dayIndex].isOpen

    if (!updatedSchedule[dayIndex].isOpen) {
      updatedSchedule[dayIndex].intervals = [{ startTime: "", endTime: "" }]
    }

    setSchedule(updatedSchedule)
    onScheduleChange(updatedSchedule)
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <FaClock className="text-primary me-2" size={20} />
        <h5 className="mb-0 fw-bold">Configuración de Horarios</h5>
      </div>

      <p className="text-muted mb-4">
        Activa los días que tu negocio esté abierto y define los horarios de atención. Puedes agregar múltiples
        intervalos para cada día (por ejemplo, mañana y tarde).
      </p>

      <Card className="border shadow-sm mb-4">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: "20%" }} className="border-bottom">
                  Día
                </th>
                <th style={{ width: "60%" }} className="border-bottom">
                  Horario de Atención
                </th>
                <th style={{ width: "20%" }} className="border-bottom">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((dia, dayIndex) => (
                <tr key={dia.day} className={dia.isOpen ? "" : "text-muted"}>
                  <td className="align-middle">
                    <Form.Check
                      type="switch"
                      id={`day-${dia.day}-switch`}
                      label={<span className={dia.isOpen ? "fw-semibold" : ""}>{dia.dayName}</span>}
                      checked={dia.isOpen}
                      onChange={() => toggleDay(dayIndex)}
                      className="ms-2"
                    />
                  </td>
                  <td>
                    {dia.intervals.map((interval, intervalIndex) => (
                      <Row key={intervalIndex} className="mb-2 g-2 align-items-center">
                        <Col xs={5}>
                          <TimePicker10Min
                            value={interval.startTime}
                            onChange={(newTime) => handleTimeChange(dayIndex, intervalIndex, "startTime", newTime)}
                            disabled={!dia.isOpen}
                          />
                        </Col>
                        <Col xs={1} className="text-center px-0">
                          <span className="text-muted">-</span>
                        </Col>
                        <Col xs={5}>
                          <TimePicker10Min
                            value={interval.endTime}
                            onChange={(newTime) => handleTimeChange(dayIndex, intervalIndex, "endTime", newTime)}
                            disabled={!dia.isOpen}
                          />
                        </Col>
                        <Col xs={1} className="text-center px-0">
                          {dia.intervals.length > 1 && (
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => removeInterval(dayIndex, intervalIndex)}
                              disabled={!dia.isOpen}
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </td>
                  <td className="align-middle">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addInterval(dayIndex)}
                      disabled={!dia.isOpen}
                      className="rounded-pill"
                    >
                      <FaPlus className="me-1" /> Agregar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CalendarioTurno

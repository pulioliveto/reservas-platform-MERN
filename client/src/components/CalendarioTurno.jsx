import React, { useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const CalendarioTurno = ({ onScheduleChange }) => {
  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => ({
      day,
      intervals: [{ startTime: "", endTime: "" }],
    }))
  );

  const handleInputChange = (dayIndex, intervalIndex, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals[intervalIndex][field] = value;
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule); // Enviar cambios al componente padre
  };

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" });
    setSchedule(updatedSchedule);
  };

  const removeInterval = (dayIndex, intervalIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals.splice(intervalIndex, 1);
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  const clearSchedule = () => {
    const resetSchedule = daysOfWeek.map((day) => ({
      day,
      intervals: [{ startTime: "", endTime: "" }],
    }));
    setSchedule(resetSchedule);
    onScheduleChange(resetSchedule);
  };


  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };
  
  const timeOptions = generateTimeOptions();
  
  return (
    <div>
      <h5>Definir Disponibilidad Horaria</h5>
      <Table bordered responsive className="text-center">
        <thead>
          <tr>
            <th>Día</th>
            <th>Intervalos de Horarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((daySchedule, dayIndex) => (
            <tr key={daySchedule.day}>
              <td>{daySchedule.day}</td>
              <td>
                {daySchedule.intervals.map((interval, intervalIndex) => (
                  <div key={intervalIndex} className="d-flex align-items-center mb-2">
                   <Form.Select
  value={interval.startTime}
  onChange={(e) =>
    handleInputChange(dayIndex, intervalIndex, "startTime", e.target.value)
  }
  className="me-2"
>
  {timeOptions.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</Form.Select>
<span>-</span>
<Form.Select
  value={interval.endTime}
  onChange={(e) =>
    handleInputChange(dayIndex, intervalIndex, "endTime", e.target.value)
  }
  className="ms-2"
>
  {timeOptions.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</Form.Select>
                    {daySchedule.intervals.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-3"
                        onClick={() => removeInterval(dayIndex, intervalIndex)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addInterval(dayIndex)}
                >
                  Agregar Intervalo
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="mt-3">
        <Col>
          <Button variant="secondary" onClick={clearSchedule} className="w-100">
            Limpiar Horarios
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CalendarioTurno;

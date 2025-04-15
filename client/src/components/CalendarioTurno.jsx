import React from 'react';
import { Button, Table, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 0, nombre: 'Domingo' }
];

const TimePicker10Min = ({ value, onChange, disabled }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '10', '20', '30', '40', '50'];

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    const [_, currentMin] = value.split(':');
    onChange(`${newHour.padStart(2, '0')}:${currentMin || '00'}`);
  };

  const handleMinuteChange = (e) => {
    const newMin = e.target.value;
    const [currentHour] = value.split(':');
    onChange(`${currentHour || '00'}:${newMin}`);
  };

  return (
    <div className="d-flex align-items-center">
      <Form.Select 
        value={value ? value.split(':')[0] : ''}
        onChange={handleHourChange}
        disabled={disabled}
        style={{ width: '70px' }}
      >
        <option value="">HH</option>
        {hours.map(hour => (
          <option key={hour} value={hour}>
            {hour.toString().padStart(2, '0')}
          </option>
        ))}
      </Form.Select>
      <span className="mx-1">:</span>
      <Form.Select
        value={value ? value.split(':')[1] : ''}
        onChange={handleMinuteChange}
        disabled={disabled}
        style={{ width: '70px' }}
      >
        <option value="">MM</option>
        {minutes.map(minute => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

const CalendarioTurno = ({ onScheduleChange }) => {
  const [schedule, setSchedule] = React.useState(
    DIAS_SEMANA.map(dia => ({
      day: dia.id,
      dayName: dia.nombre,
      intervals: [{ startTime: '', endTime: '' }],
      isOpen: false
    }))
  );

  const handleTimeChange = (dayIndex, intervalIndex, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals[intervalIndex][field] = value;
    
    // Eliminamos la validación automática que cambiaba el isOpen
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals.push({ startTime: '', endTime: '' });
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  const removeInterval = (dayIndex, intervalIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intervals.splice(intervalIndex, 1);
    
    if (updatedSchedule[dayIndex].intervals.length === 0) {
      updatedSchedule[dayIndex].intervals = [{ startTime: '', endTime: '' }];
    }
    
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  const toggleDay = (dayIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].isOpen = !updatedSchedule[dayIndex].isOpen;
    
    if (!updatedSchedule[dayIndex].isOpen) {
      // Limpiar intervalos al cerrar el día
      updatedSchedule[dayIndex].intervals = [{ startTime: '', endTime: '' }];
    }
    
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  return (
    <div className="mt-4">
      <h5>Configuración de Horarios</h5>
      <p className="text-muted mb-3">
        Activa los días que el negocio esté abierto y define sus horarios.
        Los días desactivados se considerarán cerrados.
      </p>
      
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Día</th>
            <th style={{ width: '60%' }}>Horario de Atención</th>
            <th style={{ width: '20%' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((dia, dayIndex) => (
            <tr key={dia.day}>
              <td>
                <Form.Check
                  type="switch"
                  id={`day-${dia.day}-switch`}
                  label={<strong>{dia.dayName}</strong>}
                  checked={dia.isOpen}
                  onChange={() => toggleDay(dayIndex)}
                />
              </td>
              <td>
                {dia.intervals.map((interval, intervalIndex) => (
                  <Row key={intervalIndex} className="mb-2 g-2 align-items-center">
                    <Col xs={5}>
                      <TimePicker10Min
                        value={interval.startTime}
                        onChange={(newTime) => handleTimeChange(dayIndex, intervalIndex, 'startTime', newTime)}
                        disabled={!dia.isOpen}
                      />
                    </Col>
                    <Col xs={1} className="text-center">-</Col>
                    <Col xs={5}>
                      <TimePicker10Min
                        value={interval.endTime}
                        onChange={(newTime) => handleTimeChange(dayIndex, intervalIndex, 'endTime', newTime)}
                        disabled={!dia.isOpen}
                      />
                    </Col>
                    <Col xs={1}>
                      {dia.intervals.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
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
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => addInterval(dayIndex)}
                  disabled={!dia.isOpen}
                >
                  <FaPlus /> Agregar Turno
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CalendarioTurno;
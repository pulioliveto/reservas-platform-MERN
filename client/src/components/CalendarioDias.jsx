import React, { useState } from 'react';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import '../css/CalendarioDias.css'; // Asegúrate de tener este archivo para estilos

const CalendarioDias = ({ onSelectDay }) => {
  const today = startOfDay(new Date()); // Aseguramos que se compare solo la fecha, sin horas
  const [startDay, setStartDay] = useState(today); // Día inicial de la semana
  const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado

  // Generar los próximos 7 días filtrando fechas pasadas
  const getDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i)).filter(
      (day) => !isBefore(day, today) // Excluye fechas anteriores a hoy
    );
  };

  // Manejar el cambio de semana
  const handleNextWeek = () => setStartDay(addDays(startDay, 7));
  const handlePrevWeek = () => {
    const newStartDay = addDays(startDay, -7);
    if (!isBefore(newStartDay, today)) {
      setStartDay(newStartDay); // Solo retrocede si no cruza el día de hoy
    }
  };

  return (
    <div className="calendario-dias">
      <div className="calendario-header">
        <button className="btn btn-dark" onClick={handlePrevWeek}>&laquo;</button>
        <h3>{format(startDay, 'MMMM yyyy', { locale: es })}</h3> {/* Mes y año actual */}
        <button className="btn btn-dark" onClick={handleNextWeek}>&raquo;</button>
      </div>
      <div className="calendario-dias-grid">
        {getDays().map((day) => (
          <div
            key={day}
            className={`dia ${selectedDay === day.toDateString() ? 'selected' : ''}`}
            onClick={() => {
              setSelectedDay(day.toDateString());
              onSelectDay(day); // Notifica al padre el día seleccionado
            }}
          >
            <p>{format(day, 'EEE', { locale: es })}</p> {/* Nombre del día */}
            <p>{format(day, 'd')}</p> {/* Número del día */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioDias;

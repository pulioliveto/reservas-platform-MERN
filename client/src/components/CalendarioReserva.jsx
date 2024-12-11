import React, { useState, useEffect } from 'react';
import { listEvents, createEvent } from '../../../server/googleCalendarService';

const CalendarioReserva = ({ calendarId, token }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await listEvents(calendarId, token);
      setEvents(response);
    };
    fetchEvents();
  }, [calendarId, token]);

  const handleCreateEvent = async () => {
    await createEvent(calendarId, token, newEvent);
    alert('Horario creado');
  };

  return (
    <div>
      <h2>Gestionar Horarios</h2>
      <input
        type="datetime-local"
        value={newEvent.start}
        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newEvent.end}
        onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
      />
      <button onClick={handleCreateEvent}>Crear Horario</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{`${event.start.dateTime} - ${event.end.dateTime}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioReserva;

import React, { useState } from 'react';

function ReservationForm({ onSubmit }) {
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    client: '',
    details: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reservationData);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Reserva de Turno</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={reservationData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hora</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={reservationData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cliente</label>
          <input
            type="text"
            className="form-control"
            name="client"
            value={reservationData.client}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Detalles</label>
          <textarea
            className="form-control"
            name="details"
            value={reservationData.details}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Crear Reserva
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
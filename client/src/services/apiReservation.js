const API_URL = 'http://localhost:5000/api/reservations';

// Función para crear una reserva
export const createReservation = async (reservationData, token) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reservationData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al crear la reserva');
  return data;
};

// Función para editar una reserva
export const editReservation = async (reservationId, reservationData, token) => {
  const response = await fetch(`${API_URL}/${reservationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reservationData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al editar la reserva');
  return data;
};

// Función para eliminar una reserva
export const deleteReservation = async (reservationId, token) => {
  const response = await fetch(`${API_URL}/${reservationId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al eliminar la reserva');
  return data;
};
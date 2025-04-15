import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
// API URL centralizado en la configuración

const BASE_URL = "http://localhost:5000/api/turnos"; // URL base del backend para reservas

// Función para reservar un turno
export const reservarTurno = async (data) => {
  try {
    const auth = getAuth(); // Obtiene la instancia de autenticación
    const token = await auth.currentUser.getIdToken(); // Obtiene el token del usuario autenticado

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Error al reservar el turno");
    }

    return responseData; // Devuelve la respuesta del servidor
  } catch (error) {
    console.error("Error al reservar turno:", error);
    throw error; // Vuelve a lanzar el error para manejarlo en otro lugar
  }
};

// Función para eliminar una reserva
export const eliminarReserva = async (reservationId) => {
  try {
    const auth = getAuth(); // Obtiene la instancia de autenticación
    const token = await auth.currentUser.getIdToken(); // Obtiene el token del usuario autenticado

    const response = await fetch(`${BASE_URL}/${reservationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en la cabecera
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Error al eliminar la reserva");
    }

    return responseData; // Devuelve la respuesta del servidor
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    throw error;
  }
};

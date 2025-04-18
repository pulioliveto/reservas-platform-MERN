import { getAuth } from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL + '/api'; // Ajusta la URL de acuerdo a tu configuración

export const getGoogleCalendarEvents = async (accessToken, calendarId) => {
  try {
    const response = await fetch(`${API_URL}/google-calendar-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, calendarId }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los eventos del calendario');
    }
    const data = await response.json();
    return data; // Devuelve los eventos obtenidos
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCalendarId = () => {
  // Si tienes un calendario específico, puedes definirlo aquí
  return 'primary'; // 'primary' es el ID del calendario principal del usuario
  // Si necesitas un ID diferente, reemplaza 'primary' con el ID correcto
};

export const getAccessToken = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    throw error;
  }
};

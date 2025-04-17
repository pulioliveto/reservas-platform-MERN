const API_URL = "http://localhost:5000/api";

// Crear negocio
export const createBusiness = async (data, token) => {
  if (!token) {
    throw new Error("Token de autenticación es requerido");
  }

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('address', data.address);
  formData.append('phone', data.phone);
  formData.append('instagram', data.instagram);
  formData.append('facebook', data.facebook);
  if (data.logo) {
    formData.append('logo', data.logo);
  }
  if (data.youtube) {
    formData.append('youtube', data.youtube);
  }
  formData.append('website', data.website);
  formData.append('turnoDuration', data.turnoDuration); // Enviar duración del turno

  // Mapeo de número a nombre de día
  const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Normalizar el schedule antes de enviar
  const normalizedSchedule = data.schedule
    .filter(day => day.isOpen) // Solo días abiertos
    .map(day => ({
      day: DIAS_SEMANA[day.day],
      intervals: day.intervals.map(interval => ({
        startTime: interval.startTime,
        endTime: interval.endTime
      }))
    }));

  formData.append('schedule', JSON.stringify(normalizedSchedule));

  try {
    const response = await fetch(`${API_URL}/businesses/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el negocio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createBusiness:', error);
    throw error;
  }
};

// Obtener negocio por ID
export const getBusinessById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el negocio');
    }

    const businessData = await response.json();
    
    // Asegurar que el schedule tenga el formato correcto
    if (businessData.schedule) {
      businessData.schedule = businessData.schedule.map(day => ({
        day: day.day,
        intervals: day.intervals || []
      }));
    }

    return businessData;
  } catch (error) {
    console.error('Error en getBusinessById:', error);
    throw error;
  }
};

// Actualizar negocio
export const updateBusiness = async (id, data, token) => {
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  formData.append("instagram", data.instagram);
  formData.append("facebook", data.facebook);
  
  if (data.logo) {
    formData.append("logo", data.logo);
  }
  if (data.youtube) {
    formData.append("youtube", data.youtube);
  }
  formData.append("website", data.website);
  formData.append("turnoDuration", data.turnoDuration); // Enviar duración del turno
  // Normalizar schedule si está presente
  if (data.schedule) {
    const normalizedSchedule = data.schedule.map(day => ({
      day: day.day.charAt(0).toUpperCase() + day.day.slice(1).toLowerCase(),
      intervals: day.intervals.map(interval => ({
        startTime: interval.startTime,
        endTime: interval.endTime
      }))
    }));
    formData.append("schedule", JSON.stringify(normalizedSchedule));
  }

  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el negocio");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el negocio:", error);
    throw error;
  }
};

// Eliminar negocio
export const deleteBusiness = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al eliminar el negocio');
    return await response.json();
  } catch (error) {
    console.error("Error en deleteBusiness:", error);
    throw error;
  }
};

// Obtener negocios del usuario
export const getUserBusinesses = async (token) => {
  try {
    const response = await fetch(`${API_URL}/businesses/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los negocios');
    }

    const businesses = await response.json();
    
    // Normalizar schedules
    return businesses.map(business => ({
      ...business,
      schedule: business.schedule ? business.schedule.map(day => ({
        day: day.day,
        intervals: day.intervals || []
      })) : []
    }));
  } catch (error) {
    console.error('Error en getUserBusinesses:', error);
    throw error;
  }
};
const API_URL = "http://localhost:5000/api/businesses"; // Ajusta si es necesario

// Crear negocio
export const createBusiness = async (businessData, token) => {
  try {
    const response = await fetch(`${API_URL}/businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(businessData)
    });

    if (!response.ok) throw new Error('Error al crear el negocio');
    return await response.json();
  } catch (error) {
    console.error("Error en createBusiness:", error);
    throw error;
  }
};

// Editar negocio
export const updateBusiness = async (id, updatedData, token) => {
    try {
      const response = await fetch(`${API_URL}/businesses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
  
      if (!response.ok) throw new Error('Error al actualizar el negocio');
      return await response.json();
    } catch (error) {
      console.error("Error en updateBusiness:", error);
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
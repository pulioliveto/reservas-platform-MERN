const API_URL = "http://localhost:5000/api"; // Ajusta si es necesario

// Crear negocio
export const createBusiness = async (formData, token) => {

  const data = new FormData();
  for (const key in formData) {
    data.append(key, formData[key]);
  }

    const response = await fetch("http://localhost:5000/api/businesses/create", {
      method: 'POST',
      body: data
    });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Error al crear el negocio');
  }

    return response.json();
 
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
const API_URL = "http://localhost:5000/api"; // Ajusta si es necesario

// Crear negocio
export const createBusiness = async (data, token) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('address', data.address);
  formData.append('phone', data.phone);
  formData.append('email', data.email);
  if (data.logo) {
    formData.append('logo', data.logo); // Asegúrate de pasar un archivo
  }
  formData.append('website', data.website); 
try{

  console.log('Datos enviados:', { token, formData });

  const response = await fetch(`${API_URL}/businesses/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Incluye el token de autenticación
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
} catch(error){
  console.error('Error en createBusiness:', error.message);
    throw error;
}
};

//EDitar negocios

export const updateBusiness = async (id, data, token) => {
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  if (data.logo) {
    formData.append("logo", data.logo); // Asegúrate de pasar un archivo
  }
  formData.append("website", data.website);

  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token de autenticación
      },
      body: formData, // Envía el FormData directamente
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

  //Obtener negocios creados por un usuario en /tu-perfil
  export const getUserBusinesses = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/businesses/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los negocios');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en getUserBusinesses:', error);
      throw error;
    }
  };
  
  //Obtiene datos de un negocio especifico
  export const getBusinessById = async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/businesses/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token})}`,
        },
      });
  
      if (!response.ok) throw new Error('Error al obtener el negocio');
  
      return await response.json();
    } catch (error) {
      console.error('Error en getBusinessById:', error);
      throw error;
    }
  };
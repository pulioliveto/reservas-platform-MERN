const Business = require('../models/Business'); // Asegúrate de importar el modelo de Business

const getUserBusinesses = async (req, res) => {
  try {
    const userId = req.user.id; // Aquí se obtiene el ID del usuario desde el token
    const businesses = await Business.find({ createdBy: userId }); 
    res.status(200).json(businesses); // Devuelve los negocios
  } catch (error) {
    console.error('Error al obtener negocios:', error.message, error.stack);
    res.status(500).json({ message: 'Error al obtener los negocios' });
  }
};


const updateBusiness = async (req, res) => {
    const { id } = req.params; // ID del negocio a actualizar
    const updatedData = req.body;
  
    try {
      const updatedBusiness = await Business.findByIdAndUpdate(
        id,
        updatedData,
        { new: true } // Retorna el negocio actualizado
      );
  
      if (!updatedBusiness) {
        return res.status(404).json({ message: 'Negocio no encontrado' });
      }
  
      res.status(200).json(updatedBusiness);
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      res.status(500).json({ message: 'Error al actualizar el negocio' });
    }
  };  

module.exports = {
  getUserBusinesses,updateBusiness
};

const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const upload = require('../upload');// Middleware de subida de archivos}
const multer = require('multer')
const { auth } = require('../middleware/firebaseAuth');

// Configuración de multer para almacenar los archivos en una carpeta local llamada 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const uploads = multer({ storage });



// Crear un nuevo negocio
router.post('/create', uploads.single('logo'), async (req, res) => {
  try {   
    console.log("Datos recibidos en el backend:", req.body);
    console.log("Archivo recibido:", req.file);    

    if (!req.body.name || !req.body.address || !req.body.phone || !req.body.email) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const businessData = {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website || '',
      logo: req.file ? req.file.filename : null, // Guardar el nombre del archivo si se subió
    };

    const business = new Business(businessData);
    await business.save();
      
    res.status(201).json({ message: 'Negocio creado con éxito', business});
  } catch (error) {
    console.error('Error al crear el negocio:', error); // Ver el error específico
    res.status(500).json({ message: 'Error al crear el negocio', error: error.message });
  }
});



module.exports = router;
  // Obtener todos los negocios
router.get('/search', async (req, res) => {
  const { query } = req.query;
  console.log("Consulta de busqueda recibida", query);
    try {
      if (!query) {
        return res.status(400).json({ message: "El término de búsqueda no puede estar vacío" });
      }
      const businesses = await Business.find(
        {
          name: { $regex: query, $options: 'i' }, // Búsqueda insensible a mayúsculas y minúsculas
        }
      );
      res.json(businesses);
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/user', auth, async (req, res) => {
    try {
      console.log('Usuario autenticado en /user:', req.user);
  
      const businesses = await Business.find({ createdBy: req.user.uid });
      console.log('Negocios encontrados:', businesses);
  
      res.json(businesses);
    } catch (error) {
      console.error('Error al obtener los negocios del usuario:', error);
      res.status(500).json({ message: 'Error al obtener los negocios' });
    }
  });
  
  

  // Obtener un negocio por ID
router.get('/:id', async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);
      if (!business) return res.status(404).json({ message: 'Business not found' });
      res.json(business);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Actualizar un negocio
router.put('/:id', async (req, res) => {
    try {
      const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!business) return res.status(404).json({ message: 'Business not found' });
      res.json(business);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Eliminar un negocio
router.delete('/:id', async (req, res) => {
    try {
      const business = await Business.findByIdAndDelete(req.params.id);
      if (!business) return res.status(404).json({ message: 'Business not found' });
      res.json({ message: 'Business deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;
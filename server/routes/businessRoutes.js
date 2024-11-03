const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const upload = require('../upload');// Middleware de subida de archivos

// Configuración de multer para almacenar los archivos en una carpeta local llamada 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Crear un nuevo negocio
router.post('/create', upload.single('logo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const logo = req.file ? req.file.path : null;

    const newBusiness = new Business({ name, description, logo });
    await newBusiness.save();

    res.status(201).json({ message: 'Negocio creado con éxito', business: newBusiness });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el negocio', error: error.message });
  }
});

module.exports = router;
  // Obtener todos los negocios
router.get('/search', async (req, res) => {
  const { name } = req.query;
    try {
      const businesses = await Business.find(
        {
          name: { $regex: name, $options: 'i' }, // Búsqueda insensible a mayúsculas y minúsculas
        }
      );
      res.json(businesses);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
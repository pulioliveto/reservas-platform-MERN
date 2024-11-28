const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const upload = require('../upload');// Middleware de subida de archivos}
const multer = require('multer')
const path = require("path");
const { auth } = require('../middleware/firebaseAuth');
const { getUserBusinesses, updateBusiness } = require('../controllers/businessControllers');
 
// Configuración de multer para almacenar los archivos en una carpeta local llamada 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen"));
  }
};

const uploads = multer({ storage, fileFilter  });


// Crear un nuevo negocio
router.post('/create', auth, uploads.single('logo'), async (req, res) => {
  try {
    const { name, description, address, phone, email, website } = req.body;

    // Validar campos obligatorios
    if (!name || !address || !phone || !email) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const businessData = {
      name,
      description,
      address,
      phone,
      email,
      website: website || '',
      logo: req.file ? req.file.filename : null, // Guardar solo el nombre del archivo
      createdBy: req.user.uid,
    };

    const business = new Business(businessData);
    await business.save();

    res.status(201).json({ message: 'Negocio creado con éxito', business });
  } catch (error) {
    console.error('Error al crear el negocio:', error);
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
      if (!business) {
        return res.status(404).json({ message: 'Negocio no encontrado' });
      }
      res.status(200).json(business);
    } catch (error) {
      console.error('Error al obtener el negocio:', error);
      res.status(500).json({ message: 'Error al obtener el negocio' });
    }
  });

  // Ruta para actualizar un negocio
router.put('/:id', auth, uploads.single('logo'), async (req, res) => {
  const { id } = req.params;
  const { name, description, address, phone, email, website } = req.body;

  const updatedData = {
    name,
    description,
    address,
    phone,
    email,
    website,
    logo: req.file ? req.file.filename : undefined, // Guardar solo el nombre del archivo
  };

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedBusiness) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }

    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error("Error al actualizar el negocio:", error);
    res.status(500).json({ message: "Error al actualizar el negocio" });
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
  


// Ruta para obtener los negocios del usuario autenticado
router.get('/businesses/user', auth, getUserBusinesses);


  module.exports = router;
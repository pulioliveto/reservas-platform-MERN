const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const upload = require('../upload');// Middleware de subida de archivos}
const multer = require('multer')
const path = require("path");
const { auth } = require('../middleware/firebaseAuth');
const { getUserBusinesses, updateBusiness} = require('../controllers/businessControllers');
 
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


// Ruta para crear un nuevo negocio
router.post('/create', auth, uploads.single('logo'), async (req, res) => {
  try {
    console.log('Datos recibidos en el backend:', req.body);

    const { name, description, address, phone, email, website, schedule } = req.body;

    // Validar campos obligatorios
    if (!name || !address || !phone || !email) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Parsear y validar el campo schedule
    let parsedSchedule;
    try {
      parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;

      // Verificar que el resultado sea un array
      if (!Array.isArray(parsedSchedule)) {
        throw new Error('El campo schedule debe ser un array de objetos.');
      }
    } catch (error) {
      return res.status(400).json({ message: 'Formato de schedule inválido', error: error.message });
    }

    // Validar que el schedule tenga al menos un día definido
    if (!parsedSchedule || parsedSchedule.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar horarios para el negocio.' });
    }

    // Construir los datos del negocio
    const businessData = {
      name,
      description,
      address,
      phone,
      email,
      website: website || '',
      logo: req.file ? req.file.filename : null, // Guardar solo el nombre del archivo
      schedule: parsedSchedule, // Usar el schedule parseado
      createdBy: req.user.uid, // ID del usuario que creó el negocio
    };

    // Crear y guardar el negocio en la base de datos
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
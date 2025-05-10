import express from 'express';
import Business from '../models/Business.js';
import upload from '../upload.js';
import { auth } from '../middleware/firebaseAuth.js';
import { getUserBusinesses, updateBusiness } from '../controllers/businessControllers.js';

const router = express.Router();

// Ruta para crear un nuevo negocio
router.post('/create', auth, upload.single('logo'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;
    const { name, description, address, phone, facebook, instagram, youtube, website, schedule, turnoDuration } = req.body;

    // Validar campos obligatorios
    if (!name || !address || !phone) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Parsear y validar el campo schedule
    let parsedSchedule;
    try {
      parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      if (!Array.isArray(parsedSchedule)) {
        throw new Error('El campo schedule debe ser un array de objetos.');
      }
    } catch (error) {
      return res.status(400).json({ message: 'Formato de schedule inválido', error: error.message });
    }

    if (!parsedSchedule || parsedSchedule.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar horarios para el negocio.' });
    }

    // Construir los datos del negocio
    const businessData = {
      name,
      description,
      address,
      phone,
      facebook,
      instagram,
      youtube,
      website: website || '',
      logo: req.file ? req.file.path : null, // URL de Cloudinary
      schedule: parsedSchedule,
      turnoDuration: Number(turnoDuration),
      createdBy: req.user.uid,
      ownerEmail
    };

    const business = new Business(businessData);
    await business.save();

    res.status(201).json({ message: 'Negocio creado con éxito', business });
  } catch (error) {
    console.error('Error al crear el negocio:', error);
    res.status(500).json({ message: 'Error al crear el negocio', error: error.message });
  }
});

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
router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  const { name, description, address, phone, facebook, instagram, youtube, website } = req.body;

  const updatedData = {
    name,
    description,
    address,
    phone,
    facebook,
    instagram,
    youtube,
    website,
    logo: req.file ? req.file.path : undefined, // URL de Cloudinary
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
    // Eliminar todas las reservas asociadas a este negocio
    await import('../models/Reservation.js').then(({ default: Reservation }) => Reservation.deleteMany({ negocioId: req.params.id }));
    res.json({ message: 'Business deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener los negocios del usuario autenticado
router.get('/businesses/user', auth, getUserBusinesses);

export default router;
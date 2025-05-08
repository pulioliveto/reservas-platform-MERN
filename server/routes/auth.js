import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Ruta para registrar o autenticar usuarios con Google
router.post('/login', auth, async (req, res) => {
  const { uid, name, email } = req.user; // Información obtenida del middleware
  console.log("LLEGA A /API/aUTH/LOGIN");
  console.log("Intentando loguear/registrar usuario:", uid, name, email);

  try {
    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ uid });

    if (!user) {
      // Si no existe, lo creamos
      user = new User({
        uid,
        name,
        email,
      });
      await user.save();
    }

    res.status(200).json({
      message: 'Usuario autenticado',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
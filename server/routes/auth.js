const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/firebaseAuth'); // Middleware para verificar el token de Firebase

// Ruta para registrar o autenticar usuarios con Google
router.post('/login', auth, async (req, res) => {
  const { uid, name, email } = req.user; // Información obtenida del middleware

  try {
    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ googleId: uid });

    if (!user) {
      // Si no existe, lo creamos
      user = new User({
        googleId: uid,
        name: name,
        email: email,
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

module.exports = router;
const admin = require('firebase-admin');

exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token.' });
  }

  try {
    // Verificar el token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      name: decodedToken.name,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token no válido o expirado' });
  }
};
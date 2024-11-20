const admin = require('firebase-admin');

exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token.' });
  }

  try {
    // Verificar el token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token decodificado:', decodedToken);
    req.user = {
      uid: decodedToken.uid,
      name: decodedToken.name || 'sin nombre',
      email: decodedToken.email,
    };
    console.log('Usuario autenticado en req.user:', req.user);
    
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token no válido o expirado' });
  }
};


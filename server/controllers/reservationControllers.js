import Reservation from '../models/Reservation.js';

// Crear una nueva reserva
const createReservation = async (req, res) => {
  const { negocioId, turno, fecha, dni, telefono, email, empleadoId } = req.body;
  const userId = req.user.uid;  // Obtener el id del usuario desde el token
  const userName = req.user.name || req.user.displayName || "Sin nombre"; // Obtener el nombre del usuario desde el token

  console.log('req.user:', req.user);
  console.log('Body recibido:', req.body);

  try {
    const newReservation = new Reservation({
      negocioId,
      clienteId: userId, // usa el del token, no el del body
      clienteNombre: userName,
      fecha,
      turno,     
      dni,
      telefono,
      email,
      empleadoNombre: empleadoId, // <-- Guardar el nombre del empleado seleccionado
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

// Obtener todas las reservas de un usuario
const getUserReservations = async (req, res) => {
  const userId = req.user.id; // Obtener el id del usuario desde el token

  try {
    const reservations = await Reservation.find({ user: userId })
      .populate('business')
      .populate('user', 'name email')
      .exec();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

export { createReservation, getUserReservations };
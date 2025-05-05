import Reservation from '../models/Reservation.js';

// Crear una nueva reserva
const createReservation = async (req, res) => {
  const { businessId, date, time, dni, telefono, email } = req.body;
  const userId = req.user.id;  // Obtener el id del usuario desde el token

  try {
    const newReservation = new Reservation({
      user: userId,
      business: businessId,
      date,
      time,
      dni,
      telefono,
      email,
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
      .populate('business')  // Para obtener los detalles del negocio
      .exec();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

export { createReservation, getUserReservations };
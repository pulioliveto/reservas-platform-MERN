const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },  // Ejemplo: '14:00'
  status: { type: String, default: 'pending' },  // Pendiente, Confirmada, Cancelada
});


const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
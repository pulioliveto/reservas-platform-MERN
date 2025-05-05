import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  negocioId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  clienteId: { type: String, ref: "User", required: true },
  turno: { type: String, required: true }, // Ejemplo: "10:00 - 11:00"
  fecha: { type: Date, required: true },
  dni: { type: Number, required: true }, // DNI del cliente
  telefono: { type: Number, required: true }, //  Teléfono del cliente
  email: { type: String, required: true }, // Correo electrónico del cliente
  isAvailable: { type: Boolean, default: true }, // Controlar disponibilidad
});

export default mongoose.model("Reservation", reservationSchema);

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  negocioId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  clienteId: { type: String, ref: "User", required: true },
  turno: { type: String, required: true }, // Ejemplo: "10:00 - 11:00"
  fecha: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true }, // Controlar disponibilidad
});

export default mongoose.model("Reservation", reservationSchema);

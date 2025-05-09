import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  negocioId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  clienteId: { type: String, required: true }, // uid de Firebase
  clienteNombre: { type: String, required: true }, // Nombre del clien
  turno: { type: String, required: true },
  fecha: { type: Date, required: true },
  dni: { type: Number, required: true },
  telefono: { type: Number, required: true },
  email: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.model("Reservation", reservationSchema);

import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  negocioId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String },
});

export default mongoose.model("Employee", employeeSchema);
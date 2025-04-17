import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // UID del admin destinatario
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  clientName: { type: String },
  date: { type: Date },
});

export default mongoose.model('Notification', notificationSchema);

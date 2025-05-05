import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  phone: { type: String},
  facebook: { type: String },
  instagram: { type: String },
  youtube: { type: String },
  website: { type: String },
  logo: { type: String },
  schedule: [
    {
      day: { 
        type: String, 
        required: true,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      },
      intervals: [
        {
          startTime: { 
            type: String, 
            required: true,
            validate: {
              validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
              },
              message: props => `${props.value} no es un formato de hora válido (HH:MM)`
            }
          },
          endTime: { 
            type: String, 
            required: true,
            validate: {
              validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
              },
              message: props => `${props.value} no es un formato de hora válido (HH:MM)`
            }
          }
        }
      ]
    }
  ],
  turnoDuration: { type: Number, required: true }, // Duración de cada turno en minutos
  createdBy: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  ownerEmail: { type: String, required: true } // Email del propietario
});

export default mongoose.model('Business', businessSchema);
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
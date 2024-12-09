const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  description: {
     type: String, 
    required: false},
  address: { 
    type: String, 
    required: true },
  phone: { 
    type: String, 
    required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true },
    
    website:{
      type: String,
      required:false,
    },
  logo: { 
    type: String,
    required:false,
    default: null

  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: 
  { type: String,
    required: true }, // Vincula al usuario
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
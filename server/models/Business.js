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

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  logo: { 
    type: String
  } ,
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
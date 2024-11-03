const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Crear una nueva reserva
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todas las reservas de un negocio
router.get('/business/:businessId', async (req, res) => {
    try {
      const reservations = await Reservation.find({ business: req.params.businessId });
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Obtener una reserva por ID
router.get('/:id', async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Actualizar una reserva
router.put('/:id', async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
      res.json(reservation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Eliminar una reserva
  router.delete('/:id', async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
      if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
      res.json({ message: 'Reservation deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;
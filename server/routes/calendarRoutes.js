const express = require('express');
const { callendarControllers } = require('../controllers/calendarControllers');
const router = express.Router();

// Ruta para obtener los eventos del calendario
router.post('/google-calendar-events', callendarControllers);

module.exports = router;

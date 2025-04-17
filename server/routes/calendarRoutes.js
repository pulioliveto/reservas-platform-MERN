import express from 'express';
import { callendarControllers } from '../controllers/calendarControllers.js';

const router = express.Router();

// Ruta para obtener los eventos del calendario
router.post('/google-calendar-events', callendarControllers);

export default router;

const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { auth } = require("../middleware/firebaseAuth")

router.post("/", async (req, res) => {
  const { negocioId, clienteId, turno, fecha } = req.body;

  // Validar datos de entrada
  if (!negocioId || !clienteId || !turno || !fecha) {
    return res.status(400).json({ error: "Faltan datos requeridos para la reserva." });
  }

  try {
    console.log("Datos recibidos en el backend:", { negocioId, clienteId, turno, fecha });

    // Verifica si el turno ya fue reservado
    const existingReservation = await Reservation.findOne({ negocioId, turno, fecha });

    console.log("Reserva existente:", existingReservation);

    if (existingReservation && !existingReservation.isAvailable) {
      return res.status(400).json({ error: "El turno ya no está disponible." });
    }

    // Crear una nueva reserva
    const newReservation = new Reservation({
      negocioId,
      clienteId,
      turno,
      fecha,
      isAvailable: false, // Marca el turno como no disponible
    });

    await newReservation.save();

    console.log("Reserva creada:", newReservation);

    res.status(201).json({ message: "Turno reservado con éxito", reservation: newReservation });
  } catch (error) {
    console.error("Error al reservar el turno:", error);
    res.status(500).json({ error: "Ocurrió un problema al reservar el turno" });
  }
});


// Ruta para obtener los turnos del usuario autenticado
router.get('/mis-turnos', auth , async (req, res) => {
  try {
    const userId = req.user.uid; // Usamos uid en lugar de id si usas Firebase Admin SDK
    const turnos = await Reservation.find({ clienteId: userId }).populate('negocioId');
    res.json(turnos);
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
    res.status(500).json({ message: "Error al obtener los turnos" });
  }
});

router.get("/:negocioId", async (req, res) => {
  const { negocioId } = req.params;

  try {
    const turnos = await Reservation.find({ negocioId });
    res.status(200).json(turnos);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({ error: "No se pudieron obtener los turnos" });
  }
});



module.exports = router;

import express from 'express';
import Reservation from '../models/Reservation.js';
import { auth } from '../middleware/firebaseAuth.js';
import Business from '../models/Business.js';
import User from '../models/User.js';
import { notifyReserva, notifyCancelacion, getAdminNotifications, markNotificationsRead, clearAllNotifications } from '../controllers/notificationController.js';
import Empleado from '../models/Employee.js';

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { negocioId, turno, fecha, dni, telefono, email, empleadoId } = req.body;
  const clienteId = req.user.uid; // <-- del token
  const clienteNombre = req.user.name || "Sin nombre"; // <-- del token

  // Validar datos de entrada
  if (!negocioId || !turno || !fecha) {
    return res.status(400).json({ error: "Faltan datos requeridos para la reserva." });
  }

  try {
    console.log("Datos recibidos en el backend:", { negocioId, turno, fecha, dni, telefono, email });
    console.log("Usuario autenticado PROBANDOOOO:", { clienteId, clienteNombre });

    // Verifica si el turno ya fue reservado
    const existingReservation = await Reservation.findOne({ negocioId, turno, fecha });

    if (existingReservation && !existingReservation.isAvailable) {
      return res.status(400).json({ error: "El turno ya no está disponible." });
    }

    // Buscar el nombre del empleado si hay empleadoId
    let empleadoNombre = "";
    if (empleadoId) {
      const empleado = await Empleado.findById(empleadoId);
      if (empleado) empleadoNombre = empleado.nombre;
    }

    // Crear una nueva reserva
    const newReservation = new Reservation({
      negocioId,
      clienteId,
      clienteNombre,
      turno,
      fecha,
      dni,
      telefono,
      email,
      empleadoNombre, // ahora guarda el nombre, no el ID
      isAvailable: false,
    });

    await newReservation.save();
    await notifyReserva({ negocioId, clienteId, fecha, turno, reservationId: newReservation._id, req });

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
  const { fecha } = req.query;
  try {
    let filter = { negocioId };
    if (fecha) {
      // Filtra por la fecha exacta (todo el día)
      const start = new Date(fecha);
      const end = new Date(fecha);
      end.setHours(23, 59, 59, 999);
      filter.fecha = { $gte: start, $lte: end };
    }
    const turnos = await Reservation.find(filter);
    res.status(200).json(turnos);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({ error: "No se pudieron obtener los turnos" });
  }
});

// Obtener todas las reservas de un negocio (solo para el dueño)
router.get('/:negocioId/all', auth, async (req, res) => {
  try {
    const { negocioId } = req.params;
    // Solo el dueño puede ver las reservas
    const negocio = await Business.findById(negocioId);
    if (!negocio) return res.status(404).json({ message: 'Negocio no encontrado' });
    if (negocio.createdBy !== req.user.uid) return res.status(403).json({ message: 'No autorizado' });
    // Buscar reservas y traer info básica del cliente
    const reservas = await Reservation.find({ negocioId });
    // Buscar nombres de clientes
    const clientesIds = reservas.map(r => r.clienteId);
    const clientes = await User.find({ googleId: { $in: clientesIds } });
    const clientesMap = {};
    clientes.forEach(c => { clientesMap[c.googleId] = c.name; });
    // Agregar nombre del cliente a cada reserva
    const reservasConNombre = reservas.map(r => ({
      ...r.toObject(),
      clienteNombre: r.clienteNombre || clientesMap[r.clienteId] || r.clienteId || null
    }));
    res.json(reservasConNombre);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reservas', error: err.message });
  }
});

// Eliminar una reserva por ID
router.delete("/:id", auth, async (req, res) => {
  try {
    // Buscar la reserva antes de eliminarla
    const reserva = await Reservation.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    // Buscar info del negocio y cliente
    const negocio = await Business.findById(reserva.negocioId);
    const cliente = await User.findOne({ googleId: reserva.clienteId });
    const clienteNombre = cliente && cliente.name ? cliente.name : reserva.clienteId;
    const adminUid = negocio ? negocio.createdBy : null;
    const fechaStr = new Date(reserva.fecha).toLocaleDateString('es-AR');
    const mensaje = `${clienteNombre} canceló el turno ${reserva.turno} el ${fechaStr} a ${negocio ? negocio.name : ''}`;
    // Eliminar la reserva
    await Reservation.findByIdAndDelete(req.params.id);
    await notifyCancelacion({ reserva, req });
    res.json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    res.status(500).json({ error: "No se pudo eliminar la reserva" });
  }
});

// Obtener notificaciones del usuario autenticado (admin)
router.get('/notificaciones/admin', auth, getAdminNotifications);

// Marcar notificaciones como leídas
router.post('/notificaciones/marcar-leidas', auth, markNotificationsRead);

// Limpiar todas las notificaciones del usuario autenticado
router.post('/notificaciones/limpiar-todas', auth, clearAllNotifications);

export default router;

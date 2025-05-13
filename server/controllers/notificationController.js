import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Business from '../models/Business.js';
import { notifyReservaAdmin, notifyReservaCliente, notifyCancelacionAdmin } from '../utils/emailNotifications.js';

// Crear notificación de reserva
export const notifyReserva = async ({ negocioId, clienteId, fecha, turno, reservationId, req }) => {
  const negocio = await Business.findById(negocioId);
  if (!negocio) return;
  const cliente = await User.findOne({ uid: clienteId });
  // Prioriza el nombre de req.user, luego el de la base, luego el ID
  const clienteNombre = req.user?.name || (cliente && cliente.name) || clienteId || "Cliente desconocido";
  const adminUid = negocio.createdBy;
  const adminEmail = negocio.email || "reservaturnosapp@gmail.com"; // o el email del dueño
  const clienteEmail = cliente?.email || "";
  const empleadoNombre = reservationId?.empleadoNombre || ""; // ajusta según tu modelo
  const negocioNombre = negocio.name;
  const fechaStr = new Date(fecha).toLocaleDateString('es-AR');
  const mensaje = `${clienteNombre} reservó un turno a ${negocio.name} el ${fechaStr} (${turno})`;

  // Notificación en la app
  const notification = await Notification.create({
    recipient: adminUid,
    message: mensaje,
    reservationId,
    businessId: negocio._id,
    clientName: clienteNombre,
    date: fecha,
  });

  // Notificación por email al admin
  await notifyReservaAdmin({
    adminEmail,
    clienteNombre,
    clienteEmail,
    fecha: fechaStr,
    turno,
    empleadoNombre,
    negocioNombre,
  });

  // Notificación por email al cliente
  if (clienteEmail) {
    await notifyReservaCliente({
      clienteEmail,
      negocioNombre,
      fecha: fechaStr,
      turno,
      empleadoNombre,
    });
  }

  // Emitir en tiempo real si el admin está conectado
  const io = req.app.get('io');
  const userSockets = req.app.get('userSockets');
  const socketId = userSockets.get(adminUid);
  if (io && socketId) {
    io.to(socketId).emit('nueva_notificacion', notification);
  }
};

// Crear notificación de cancelación
export const notifyCancelacion = async ({ reserva, req }) => {
  const negocio = await Business.findById(reserva.negocioId);
  const cliente = await User.findOne({ uid: reserva.clienteId });
  const clienteNombre = cliente && cliente.name ? cliente.name :(req.user?.name || cliente.name);
  const adminUid = negocio?.createdBy;
  const fechaStr = new Date(reserva.fecha).toLocaleDateString('es-AR');
  const mensaje = `${clienteNombre} canceló el turno ${reserva.turno} el ${fechaStr} a ${negocio?.name || ''}`;
  if (adminUid) {
    const notification = await Notification.create({
      recipient: adminUid,
      message: mensaje,
      reservationId: reserva._id,
      businessId: reserva.negocioId,
      clientName: clienteNombre,
      date: reserva.fecha,
    });

    // --- ENVÍA EL EMAIL AL ADMIN ---
    await notifyCancelacionAdmin({
      adminEmail: negocio?.email || "reservaturnosapp@gmail.com",
      clienteNombre,
      fecha: fechaStr,
      turno: reserva.turno,
      negocioNombre: negocio?.name || "",
    });

    // Emitir en tiempo real si el admin está conectado
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const socketId = userSockets.get(adminUid);
    if (io && socketId) {
      io.to(socketId).emit('nueva_notificacion', notification);
    }
  }
};

// Obtener notificaciones
export const getAdminNotifications = async (req, res) => {
  try {
    const notificaciones = await Notification.find({ recipient: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notificaciones);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: err.message });
  }
};

// Marcar como leídas
export const markNotificationsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    await Notification.updateMany({ _id: { $in: ids }, recipient: req.user.uid }, { $set: { read: true } });
    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar notificaciones', error: err.message });
  }
};

// Limpiar todas
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user.uid });
    res.json({ message: 'Todas las notificaciones eliminadas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar notificaciones', error: err.message });
  }
};
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import businessRoutes from './routes/businessRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import authRoutes from './routes/auth.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-setup.js';
import path from 'path';
import multer from 'multer';
import admin from 'firebase-admin';
import calendarRoutes from './routes/calendarRoutes.js';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();

// Sirve la carpeta "uploads" para acceso público
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
console.log('Mongo URI:', process.env.MONGO_URI);

app.use('/api/calendar', calendarRoutes);

//Conexion a MONGODB.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => console.log('Conectado a MongoDB')) .catch((err) => console.error('Error al conectar a MongoDB', err));

// Crear el servidor HTTP y pasar a Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Mapa para asociar UID de usuario con su socket
const userSockets = new Map();

io.on('connection', (socket) => {
  // Espera el evento 'register' con el UID del usuario
  socket.on('register', (uid) => {
    userSockets.set(uid, socket.id);
  });

  // Limpieza al desconectar
  socket.on('disconnect', () => {
    for (const [uid, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(uid);
        break;
      }
    }
  });
});

// Hacer accesible io y userSockets en toda la app
app.set('io', io);
app.set('userSockets', userSockets);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Servidor corriendo en el puerto ${PORT}`); });

// Configuración del CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes desde el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'], 
  }));

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, './config/serviceAccountKey.json'), 'utf8')
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log('Firebase Admin SDK inicializado correctamente.');

// Configurar express-session
app.use(session({
    secret: '44165935', // Cambia esto por una clave secreta más segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // En producción, configúralo en true si usas HTTPS
  }));

//Pasport inicia sesion con Google e Instagram
app.use(passport.initialize());
app.use(passport.session());

// Usar rutas API 
app.use('/api/businesses', businessRoutes);
app.use('/api/turnos', reservationRoutes);

//Ruta para login con Auth 
app.use('/api/auth', authRoutes);

// Usar las rutas de Google Calendar
app.use('/api', calendarRoutes);

app.get('/', (req, res) => { res.send('¡Bienvenido a la plataforma de reservas!'); });
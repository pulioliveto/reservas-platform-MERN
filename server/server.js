const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const businessRoutes = require('./routes/businessRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const session = require('express-session');
require('./config/passport-setup');
const path = require("path");
const multer = require('multer');
const admin = require('firebase-admin');
const calendarRoutes = require('./routes/calendarRoutes');



const app = express();

dotenv.config()

// Sirve la carpeta "uploads" para acceso público
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
console.log('Mongo URI:', process.env.MONGO_URI);

app.use('/api/calendar', calendarRoutes);


//Conexion a MONGODB.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => console.log('Conectado a MongoDB')) .catch((err) => console.error('Error al conectar a MongoDB', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Servidor corriendo en el puerto ${PORT}`); });

// Configuración del CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes desde el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'], 
  }));

  const serviceAccount = require("./config/serviceAccountKey.json");
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
app.use('/api/reservations', reservationRoutes);

//Ruta para login con Auth 
app.use('/api/auth', authRoutes);

// Usar las rutas de Google Calendar
app.use('/api', calendarRoutes);


app.get('/', (req, res) => { res.send('¡Bienvenido a la plataforma de reservas!'); });
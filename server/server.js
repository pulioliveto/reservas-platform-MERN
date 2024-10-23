const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

app.use(express.json());


app.get('/', (req, res) => { res.send('¡Bienvenido a la plataforma de reservas!'); });
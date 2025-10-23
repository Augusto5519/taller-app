const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares (configuraciones iniciales)
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/ordenes', require('./routes/ordenes'));
app.use('/api/turnos', require('./routes/turnos'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/cuentas', require('./routes/cuentas'));

// Puerto en el que correrá el servidor
const PORT = process.env.PORT || 5000;

// Iniciar el servidor para que se quede escuchando
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
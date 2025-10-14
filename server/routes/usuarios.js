// Archivo: server/routes/usuarios.js (VERSIÓN FINAL Y CORRECTA)
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/usuarios - Listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        // Usamos el nombre de columna correcto: "nombre_usuario"
        const [rows] = await db.query("SELECT id, nombre_completo, nombre_usuario, rol FROM usuarios");
        res.json(rows);
    } catch (err) { 
        console.error("Error en GET /api/usuarios:", err);
        res.status(500).send('Error del servidor'); 
    }
});

// POST /api/usuarios - Crear un nuevo usuario (empleado)
router.post('/', async (req, res) => {
    const { nombre_completo, usuario, contrasena } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

        // Usamos el nombre de columna correcto: "nombre_usuario"
        // Y en los datos, usamos la variable "usuario" que viene del formulario
        const query = 'INSERT INTO usuarios (nombre_completo, nombre_usuario, contrasena, rol) VALUES (?, ?, ?, "empleado")';
        await db.query(query, [nombre_completo, usuario, contrasenaEncriptada]);
        res.status(201).json({ msg: 'Empleado creado con éxito' });
    } catch (err) { 
        console.error("Error en POST /api/usuarios:", err);
        res.status(500).send('Error del servidor'); 
    }
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Empleado eliminado con éxito' });
    } catch (err) { 
        console.error("Error en DELETE /api/usuarios:", err);
        res.status(500).send('Error del servidor'); 
    }
});

// GET /api/usuarios/tecnicos
router.get('/tecnicos', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre_completo FROM usuarios WHERE rol = 'empleado'");
        res.json(rows);
    } catch (err) { 
        console.error("Error en GET /api/usuarios/tecnicos:", err);
        res.status(500).send('Error del servidor'); 
    }
});

module.exports = router;
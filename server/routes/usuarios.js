// Archivo: server/routes/usuarios.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/usuarios - Listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        // Usa el nombre de columna correcto: "usuario"
        const [rows] = await db.query("SELECT id, nombre_completo, usuario, rol FROM usuarios");
        res.json(rows || []);
    } catch (err) { 
        console.error("Error en GET /api/usuarios:", err);
        res.status(500).send('Error del servidor'); 
    }
});

// GET /api/usuarios/tecnicos - RUTA ESPECÍFICA 
router.get('/tecnicos', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre_completo FROM usuarios WHERE rol = 'empleado'");
        res.json(rows || []);
    } catch (err) { 
        console.error("Error en GET /api/usuarios/tecnicos:", err);
        res.status(500).send('Error del servidor'); 
    }
});

// GET /api/usuarios/:id - RUTA GENERAL 
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre_completo, usuario, rol FROM usuarios WHERE id = ?", [req.params.id]);
        res.json(rows[0] || null);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre_completo, usuario, contrasena } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);
        // Usa el nombre de columna correcto: "usuario"
        const query = 'INSERT INTO usuarios (nombre_completo, usuario, contrasena, rol) VALUES (?, ?, ?, "empleado")';
        await db.query(query, [nombre_completo, usuario, contrasenaEncriptada]);
        res.status(201).json({ msg: 'Empleado creado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { nombre_completo, usuario, contrasena } = req.body;
    try {
        let query, params;
        if (contrasena && contrasena.length > 0) {
            const salt = await bcrypt.genSalt(10);
            const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);
            query = 'UPDATE usuarios SET nombre_completo = ?, usuario = ?, contrasena = ? WHERE id = ?';
            params = [nombre_completo, usuario, contrasenaEncriptada, req.params.id];
        } else {
            query = 'UPDATE usuarios SET nombre_completo = ?, usuario = ? WHERE id = ?';
            params = [nombre_completo, usuario, req.params.id];
        }
        await db.query(query, params);
        res.json({ msg: 'Empleado actualizado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Empleado eliminado con éxito' });
    } catch (err) {
        if (err.errno === 1451) {
            return res.status(409).json({ msg: 'No se puede eliminar. El empleado tiene órdenes de trabajo asignadas.' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
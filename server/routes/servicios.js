// Archivo: server/routes/servicios.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/servicios - OBTENER todos los servicios
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM servicios ORDER BY categoria, nombre');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// POST /api/servicios - CREAR un nuevo servicio
router.post('/', async (req, res) => {
    const { nombre, categoria, precio, descripcion } = req.body;
    try {
        const query = 'INSERT INTO servicios (nombre, categoria, precio, descripcion) VALUES (?, ?, ?, ?)';
        await db.query(query, [nombre, categoria, precio, descripcion]);
        res.status(201).json({ msg: 'Servicio creado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// PUT /api/servicios/:id - ACTUALIZAR un servicio existente
router.put('/:id', async (req, res) => {
    const { nombre, categoria, precio, descripcion } = req.body;
    const { id } = req.params;
    try {
        const query = 'UPDATE servicios SET nombre = ?, categoria = ?, precio = ?, descripcion = ? WHERE id = ?';
        await db.query(query, [nombre, categoria, precio, descripcion, id]);
        res.json({ msg: 'Servicio actualizado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// DELETE /api/servicios/:id - ELIMINAR un servicio
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM servicios WHERE id = ?', [id]);
        res.json({ msg: 'Servicio eliminado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


module.exports = router;
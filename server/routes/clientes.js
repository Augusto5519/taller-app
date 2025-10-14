// Archivo: server/routes/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/clientes - OBTENER todos los clientes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes ORDER BY apellido, nombre');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// POST /api/clientes - CREAR un nuevo cliente
router.post('/', async (req, res) => {
    const { nombre, apellido, telefono, email, direccion } = req.body;
    try {
        const query = 'INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [nombre, apellido, telefono, email, direccion]);
        res.status(201).json({ msg: 'Cliente creado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// PUT /api/clientes/:id - ACTUALIZAR un cliente existente
router.put('/:id', async (req, res) => {
    const { nombre, apellido, telefono, email, direccion } = req.body;
    const { id } = req.params;
    try {
        const query = 'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?';
        await db.query(query, [nombre, apellido, telefono, email, direccion, id]);
        res.json({ msg: 'Cliente actualizado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// DELETE /api/clientes/:id - ELIMINAR un cliente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // ¡Cuidado! En una app real, antes de borrar un cliente deberíamos verificar
        // que no tenga vehículos u órdenes de trabajo asociadas. Por ahora, lo borramos directamente.
        await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.json({ msg: 'Cliente eliminado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
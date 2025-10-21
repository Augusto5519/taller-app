// Archivo: server/routes/clientes.js 
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM clientes ORDER BY apellido, nombre");
        res.json(rows || []);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM clientes WHERE id = ?", [req.params.id]);
        res.json(rows[0] || null);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.post('/', async (req, res) => {
    const { nombre, apellido, telefono, email, direccion } = req.body;
    try {
        await db.query('INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, telefono, email, direccion]);
        res.status(201).json({ msg: 'Cliente creado' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.put('/:id', async (req, res) => {
    const { nombre, apellido, telefono, email, direccion } = req.body;
    try {
        await db.query('UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?', [nombre, apellido, telefono, email, direccion, req.params.id]);
        res.json({ msg: 'Cliente actualizado' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Cliente eliminado' });
    } catch (err) {
        if (err.errno === 1451) {
            return res.status(409).json({ msg: 'Error: No se puede eliminar un cliente con vehículos asociados.' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
// Archivo: server/routes/vehiculos.js 
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const query = `SELECT v.id, v.patente, v.marca, v.modelo, v.ano, v.km, v.cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido FROM vehiculos v JOIN clientes c ON v.cliente_id = c.id ORDER BY c.apellido, v.marca;`;
        const [rows] = await db.query(query);
        res.json(rows || []);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehiculos WHERE id = ?', [req.params.id]);
        res.json(rows[0] || null);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.post('/', async (req, res) => {
    const { cliente_id, patente, marca, modelo, ano, km } = req.body;
    try {
        await db.query('INSERT INTO vehiculos (cliente_id, patente, marca, modelo, ano, km) VALUES (?, ?, ?, ?, ?, ?)', [cliente_id, patente, marca, modelo, ano, km]);
        res.status(201).json({ msg: 'Vehículo creado' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.put('/:id', async (req, res) => {
    const { cliente_id, patente, marca, modelo, ano, km } = req.body;
    try {
        await db.query('UPDATE vehiculos SET cliente_id = ?, patente = ?, marca = ?, modelo = ?, ano = ?, km = ? WHERE id = ?', [cliente_id, patente, marca, modelo, ano, km, req.params.id]);
        res.json({ msg: 'Vehículo actualizado' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vehiculos WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Vehículo eliminado' });
    } catch (err) {
        if (err.errno === 1451) {
            return res.status(409).json({ msg: 'Error: No se puede eliminar un vehículo con órdenes de trabajo asociadas.' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
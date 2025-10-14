// Archivo: server/routes/vehiculos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/vehiculos - OBTENER todos los vehículos con info del cliente
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id, v.patente, v.marca, v.modelo, v.ano, v.km, v.cliente_id,
                c.nombre AS cliente_nombre, 
                c.apellido AS cliente_apellido
            FROM vehiculos v
            JOIN clientes c ON v.cliente_id = c.id
            ORDER BY c.apellido, v.marca;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// GET /api/vehiculos/:id - OBTENER un solo vehículo por su ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehiculos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Vehículo no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// POST /api/vehiculos - CREAR un nuevo vehículo
router.post('/', async (req, res) => {
    const { cliente_id, patente, marca, modelo, ano, km } = req.body;
    try {
        const query = 'INSERT INTO vehiculos (cliente_id, patente, marca, modelo, ano, km) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [cliente_id, patente, marca, modelo, ano, km]);
        res.status(201).json({ msg: 'Vehículo creado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// PUT /api/vehiculos/:id - ACTUALIZAR un vehículo
router.put('/:id', async (req, res) => {
    const { cliente_id, patente, marca, modelo, ano, km } = req.body;
    try {
        const query = 'UPDATE vehiculos SET cliente_id = ?, patente = ?, marca = ?, modelo = ?, ano = ?, km = ? WHERE id = ?';
        await db.query(query, [cliente_id, patente, marca, modelo, ano, km, req.params.id]);
        res.json({ msg: 'Vehículo actualizado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// DELETE /api/vehiculos/:id - ELIMINAR un vehículo
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vehiculos WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Vehículo eliminado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
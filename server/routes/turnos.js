// Archivo: server/routes/turnos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/turnos - Para OBTENER todos los turnos
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id, t.fecha_turno, t.estado, t.servicio_solicitado, t.comentarios,
                c.id AS cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
                v.id AS vehiculo_id, v.marca, v.modelo, v.patente
            FROM turnos t
            JOIN clientes c ON t.cliente_id = c.id
            JOIN vehiculos v ON t.vehiculo_id = v.id
            ORDER BY t.fecha_turno ASC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// GET /api/turnos/:id - Para OBTENER UN SOLO turno (AHORA CORREGIDO)
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.*,
                c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
                v.marca, v.modelo, v.patente
            FROM turnos t
            JOIN clientes c ON t.cliente_id = c.id
            JOIN vehiculos v ON t.vehiculo_id = v.id
            WHERE t.id = ?;
        `;
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ msg: 'Turno no encontrado' });
        res.json(rows[0]);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// POST /api/turnos - Para CREAR un nuevo turno
router.post('/', async (req, res) => {
    const { cliente_id, vehiculo_id, servicio_solicitado, fecha_turno, comentarios } = req.body;
    try {
        const query = 'INSERT INTO turnos (cliente_id, vehiculo_id, servicio_solicitado, fecha_turno, comentarios) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [cliente_id, vehiculo_id, servicio_solicitado, fecha_turno, comentarios]);
        res.status(201).json({ msg: 'Turno agendado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// PUT /api/turnos/:id - Para ACTUALIZAR un turno
router.put('/:id', async (req, res) => {
    const { servicio_solicitado, fecha_turno, estado, comentarios } = req.body;
    try {
        const query = 'UPDATE turnos SET servicio_solicitado = ?, fecha_turno = ?, estado = ?, comentarios = ? WHERE id = ?';
        await db.query(query, [servicio_solicitado, fecha_turno, estado, comentarios, req.params.id]);
        res.json({ msg: 'Turno actualizado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// DELETE /api/turnos/:id - Para ELIMINAR un turno
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM turnos WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Turno eliminado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

module.exports = router;
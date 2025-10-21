// Archivo: server/routes/servicios.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/servicios - Obtener todos los servicios
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM servicios ORDER BY nombre");
        res.json(rows || []);
    } catch (err) {
        console.error('Error al obtener servicios:', err);
        res.status(500).send('Error del servidor al obtener servicios');
    }
});

// GET /api/servicios/:id - Obtener un solo servicio por su ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM servicios WHERE id = ?", [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ msg: 'Servicio no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener servicio por ID:', err);
        res.status(500).send('Error del servidor al obtener servicio');
    }
});

// POST /api/servicios - Crear un nuevo servicio
router.post('/', async (req, res) => {
    const { nombre, categoria, precio, descripcion } = req.body;
    try {
        const [result] = await db.query('INSERT INTO servicios (nombre, categoria, precio, descripcion) VALUES (?, ?, ?, ?)', [nombre, categoria, precio, descripcion]);
        res.status(201).json({ msg: 'Servicio creado con éxito', id: result.insertId });
    } catch (err) {
        console.error('Error al crear servicio:', err);
        res.status(500).send('Error del servidor al crear servicio');
    }
});

// PUT /api/servicios/:id - Actualizar un servicio existente
router.put('/:id', async (req, res) => {
    const { nombre, categoria, precio, descripcion } = req.body;
    try {
        const [result] = await db.query('UPDATE servicios SET nombre = ?, categoria = ?, precio = ?, descripcion = ? WHERE id = ?', [nombre, categoria, precio, descripcion, req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ msg: 'Servicio actualizado con éxito' });
        } else {
            res.status(404).json({ msg: 'Servicio no encontrado para actualizar' });
        }
    } catch (err) {
        console.error('Error al actualizar servicio:', err);
        res.status(500).send('Error del servidor al actualizar servicio');
    }
});

// DELETE /api/servicios/:id - Eliminar un servicio
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM servicios WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ msg: 'Servicio eliminado con éxito' });
        } else {
            res.status(404).json({ msg: 'Servicio no encontrado para eliminar' });
        }
    } catch (err) {
        console.error('Error al eliminar servicio:', err);
        // Puedes agregar manejo específico para clave foránea aquí si los servicios tuvieran dependencias
        if (err.errno === 1451) {
            return res.status(409).json({ msg: 'Error: No se puede eliminar un servicio que está asociado a órdenes de trabajo o turnos.' });
        }
        res.status(500).send('Error del servidor al eliminar servicio');
    }
});

module.exports = router;
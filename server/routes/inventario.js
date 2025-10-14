// Archivo: server/routes/inventario.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/inventario - OBTENER todos los items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventario ORDER BY nombre');
        res.json(rows);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// GET /api/inventario/:id - OBTENER un solo item
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventario WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ msg: 'Item no encontrado' });
        res.json(rows[0]);
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// POST /api/inventario - CREAR un nuevo item
router.post('/', async (req, res) => {
    const { nombre, descripcion, cantidad_stock, stock_minimo, precio_costo } = req.body;
    try {
        const query = 'INSERT INTO inventario (nombre, descripcion, cantidad_stock, stock_minimo, precio_costo) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [nombre, descripcion, cantidad_stock, stock_minimo, precio_costo]);
        res.status(201).json({ msg: 'Item creado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// PUT /api/inventario/:id - ACTUALIZAR un item
router.put('/:id', async (req, res) => {
    const { nombre, descripcion, cantidad_stock, stock_minimo, precio_costo } = req.body;
    try {
        const query = 'UPDATE inventario SET nombre = ?, descripcion = ?, cantidad_stock = ?, stock_minimo = ?, precio_costo = ? WHERE id = ?';
        await db.query(query, [nombre, descripcion, cantidad_stock, stock_minimo, precio_costo, req.params.id]);
        res.json({ msg: 'Item actualizado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

// DELETE /api/inventario/:id - ELIMINAR un item
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM inventario WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Item eliminado con éxito' });
    } catch (err) { res.status(500).send('Error del servidor'); }
});

module.exports = router;
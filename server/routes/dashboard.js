// Archivo: server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
    try {
        // Consulta 1: Órdenes abiertas
        const [orders] = await db.query("SELECT COUNT(*) as count FROM ordenes_trabajo WHERE estado = 'abierta'");

        // Consulta 2: Turnos para hoy (compara solo la fecha, no la hora)
        const [appointments] = await db.query("SELECT COUNT(*) as count FROM turnos WHERE DATE(fecha_turno) = CURDATE()");

        // Consulta 3: Items con bajo stock
        const [inventory] = await db.query("SELECT COUNT(*) as count FROM inventario WHERE cantidad_stock <= stock_minimo");

        res.json({
            ordenesAbiertas: orders[0].count,
            turnosHoy: appointments[0].count,
            itemsBajoStock: inventory[0].count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
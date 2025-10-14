// Archivo: server/routes/reportes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/reportes/trabajos-por-tecnico
router.get('/trabajos-por-tecnico', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.nombre_completo AS tecnico,
                COUNT(ot.id) AS trabajos_finalizados
            FROM ordenes_trabajo ot
            JOIN usuarios u ON ot.tecnico_id = u.id
            WHERE ot.estado = 'finalizada'
            GROUP BY u.nombre_completo
            ORDER BY trabajos_finalizados DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// RUTA para obtener todos los datos para el formulario
router.get('/form-data', async (req, res) => {
    try {
        const [clientes] = await db.query("SELECT id, nombre, apellido FROM clientes ORDER BY apellido, nombre");
        const [vehiculos] = await db.query("SELECT id, cliente_id, marca, modelo, patente FROM vehiculos");
        const [tecnicos] = await db.query("SELECT id, nombre_completo FROM usuarios WHERE rol = 'empleado'");
        
        res.json({
            clientes: clientes || [],
            vehiculos: vehiculos || [],
            tecnicos: tecnicos || []
        });
    } catch (err) {
        console.error("Error al obtener datos para el formulario de orden:", err);
        res.status(500).send('Error del servidor');
    }
});

// GET /api/ordenes - Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                ot.id, ot.estado, ot.descripcion_problema, ot.tiempo_estimado, ot.fecha_creacion,
                v.marca, v.modelo, v.patente, v.id AS vehiculo_id,
                c.id AS cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
                u.nombre_completo AS tecnico_nombre, u.id AS tecnico_id
            FROM ordenes_trabajo ot
            JOIN vehiculos v ON ot.vehiculo_id = v.id
            JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON ot.tecnico_id = u.id
            ORDER BY ot.fecha_creacion DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// POST /api/ordenes - Crear una nueva orden
router.post('/', async (req, res) => {
    const { vehiculo_id, tecnico_id, estado, descripcion_problema, tiempo_estimado } = req.body;
    try {
        const query = 'INSERT INTO ordenes_trabajo (vehiculo_id, tecnico_id, estado, descripcion_problema, tiempo_estimado) VALUES (?, ?, ?, ?, ?)';
        // Si tecnico_id es vacío, se inserta NULL
        const tecnico = tecnico_id ? tecnico_id : null;
        await db.query(query, [vehiculo_id, tecnico, estado, descripcion_problema, tiempo_estimado]);
        res.status(201).json({ msg: 'Orden de trabajo creada con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// PUT /api/ordenes/:id - Actualizar una orden
router.put('/:id', async (req, res) => {
    const { tecnico_id, estado, descripcion_problema, tiempo_estimado } = req.body;
    const tecnico = tecnico_id ? tecnico_id : null;
    try {
        const query = 'UPDATE ordenes_trabajo SET tecnico_id = ?, estado = ?, descripcion_problema = ?, tiempo_estimado = ? WHERE id = ?';
        await db.query(query, [tecnico, estado, descripcion_problema, tiempo_estimado, req.params.id]);
        res.json({ msg: 'Orden de trabajo actualizada' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// DELETE /api/ordenes/:id - Eliminar una orden
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM ordenes_trabajo WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Orden de trabajo eliminada' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
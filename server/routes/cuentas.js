// Archivo: server/routes/cuentas.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:clienteId', async (req, res) => {
    const { clienteId } = req.params;
    console.log(`--- INICIANDO DIAGNÓSTICO PARA CLIENTE ID: ${clienteId} ---`);

    try {
        console.log("Paso 1: Obteniendo info del cliente...");
        const [clienteInfo] = await db.query('SELECT id, nombre, apellido FROM clientes WHERE id = ?', [clienteId]);
        if (clienteInfo.length === 0) {
            console.log("Resultado Paso 1: Cliente no encontrado.");
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        console.log("Resultado Paso 1: Éxito.");

        console.log("Paso 2: Obteniendo órdenes de trabajo...");
        const [ordenes] = await db.query(
            `SELECT ot.id, ot.fecha_creacion AS fecha, ot.descripcion_problema AS concepto, ot.costo_total AS debe, NULL AS haber 
            FROM ordenes_trabajo ot
            JOIN vehiculos v ON ot.vehiculo_id = v.id
            WHERE v.cliente_id = ? AND ot.estado = 'finalizada'`,
            [clienteId]
        );
        console.log(`Resultado Paso 2: Se encontraron ${ordenes.length} órdenes.`);

        console.log("Paso 3: Obteniendo pagos...");
        const [pagos] = await db.query(
    "SELECT id, fecha_pago AS fecha, 'Pago' AS concepto, NULL AS debe, monto AS haber FROM pagos WHERE cliente_id = ?",
    [clienteId]
);
        console.log(`Resultado Paso 3: Se encontraron ${pagos.length} pagos.`);
        const movimientos = [...(ordenes || []), ...(pagos || [])].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        let saldo = 0;
        const historial = movimientos.map(mov => {
            saldo += (mov.debe || 0) - (mov.haber || 0);
            return { ...mov, saldo };
        });
        res.json({ cliente: clienteInfo[0], saldoActual: saldo, historial: historial.reverse() });

    } catch (err) {
        console.error("--- ¡ERROR FATAL CAPTURADO! ---");
        console.error(err);
        console.error("--- FIN DEL REPORTE DE ERROR ---");
        res.status(500).send('Error del servidor. Revisa la terminal de nodemon.');
    }
});

router.post('/pagos', async (req, res) => {
    const { cliente_id, monto, fecha_pago, metodo_pago, orden_id } = req.body;
    try {
        const query = 'INSERT INTO pagos (cliente_id, monto, fecha_pago, metodo_pago, orden_id) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [cliente_id, monto, fecha_pago, metodo_pago, orden_id || null]);
        res.status(201).json({ msg: 'Pago registrado con éxito' });
    } catch (err) {
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
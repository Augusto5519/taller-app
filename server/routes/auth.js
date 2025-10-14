const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ msg: 'Por favor, ingrese todos los campos.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Usuario no encontrado.' });
        }

        const usuario = rows[0];

        // Comparar contraseña ingresada con la encriptada en la DB
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta.' });
        }

        // Crear y firmar un token
        const payload = {
            usuario: {
                id: usuario.id,
                rol: usuario.rol,
                nombre: usuario.nombre_completo
            }
        };

        jwt.sign(payload, 'tu_secreto_jwt_super_secreto', { expiresIn: '8h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, usuario: payload.usuario });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
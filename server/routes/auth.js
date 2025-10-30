// Archivo: server/routes/auth.js 
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {

    const { nombre_usuario, contrasena } = req.body;

    try {

        const query = 'SELECT * FROM usuarios WHERE usuario = ?';
        const [users] = await db.query(query, [nombre_usuario]);

        if (users.length === 0) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        const payload = {
            usuario: {
                id: user.id,
                nombre: user.nombre_completo,
                rol: user.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    usuario: payload.usuario
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
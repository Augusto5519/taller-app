const bcrypt = require('bcryptjs');

const password = 'admin123'; // La contraseña que quieres encriptar
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error al encriptar:', err);
        return;
    }
    console.log('Contraseña original:', password);
    console.log('Contraseña encriptada (hash):', hash);
});
// Archivo: client/js/auth.js 
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const nombre_usuario = document.getElementById('username').value;
        const contrasena = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_usuario, contrasena }) 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error en el servidor');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            window.location.href = 'index.html';

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Si ya hay un token, redirigir al dashboard
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar que la página se recargue

        const nombre_usuario = document.getElementById('username').value;
        const contrasena = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre_usuario, contrasena })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al iniciar sesión');
            }

            // Guardar el token y los datos del usuario en el navegador
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            // Redirigir a la página principal
            window.location.href = 'index.html';

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});
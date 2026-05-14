// Mostrar/ocultar contraseña
document.getElementById('togglePass').addEventListener('click', function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye';
    }
});

// Mostrar mensajes según parámetros de URL
const params = new URLSearchParams(window.location.search);
if (params.get('error')) {
    document.getElementById('errorMsg').style.display = 'block';
}
if (params.get('logout')) {
    document.getElementById('logoutMsg').style.display = 'block';
}
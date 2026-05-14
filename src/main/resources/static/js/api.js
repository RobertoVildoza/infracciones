const API_BASE = 'http://localhost:9000/api/v1';

let usuarioRol = null;
let usuarioAutoridad = null;

const api = {
    get: async (url) => {
        const res = await fetch(`${API_BASE}${url}`, {
            credentials: 'include'
        });
        if (res.status === 401) { window.location.href = '/login.html'; return; }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    post: async (url, data) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (res.status === 401) { window.location.href = '/login.html'; return; }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    put: async (url, data) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (res.status === 401) { window.location.href = '/login.html'; return; }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    delete: async (url) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.status === 401) { window.location.href = '/login.html'; return; }
        if (!res.ok) throw new Error(await res.text());
        return res.status !== 204 ? res.json() : true;
    }
};

async function verificarSesion() {
    try {
        const res = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        const data = await res.json();
        if (!data.autenticado) {
            window.location.href = '/login.html';
            return null;
        }
        usuarioRol = data.rol;
        usuarioAutoridad = data.autoridad || null;
        return data;
    } catch {
        window.location.href = '/login.html';
        return null;
    }
}

function esAdmin() {
    return usuarioRol === 'ADMIN';
}

function getAutoridadUsuario() {
    return usuarioAutoridad;
}

function showAlert(containerId, message, type = 'success') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 4000);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-AR');
}
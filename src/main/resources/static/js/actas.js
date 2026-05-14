let idAEliminar = null;
let modalEliminar;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`/actas/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Acta eliminada correctamente.', 'success');
            await cargar();
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar esta acta porque está siendo utilizada por otros datos del sistema.', 'error');
        }
    });

    await cargar();
};

async function cargar() {
    const actas = await api.get('/actas');
    const tbody = document.getElementById('actasBody');
    document.getElementById('totalBadge').textContent = `${actas.length} registros`;

    if (!actas.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox me-2"></i>No hay actas registradas
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = actas.map(a => `
        <tr>
            <td><span class="fw-semibold">${a.id}</span></td>
            <td>${formatDate(a.fechaLabrado)}</td>
            <td>${a.horaLabrado || '-'}</td>
            <td>${a.lugarConstatacion || '-'}</td>
            <td>${a.autoridad ? a.autoridad.nombre + ' ' + a.autoridad.apellido : '-'}</td>
            <td>${a.licencia?.conductor ? a.licencia.conductor.nombre + ' ' + a.licencia.conductor.apellido : '-'}</td>
            <td><span class="fw-semibold">${a.vehiculo?.dominio || '-'}</span></td>
            <td><span class="badge ${estadoBadge(a.estadoDelActa?.nombreEstadoActa)} px-2 py-1">
                ${a.estadoDelActa?.nombreEstadoActa || '-'}
            </span></td>
            <td>
                ${esAdmin() ? `
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar(${a.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                ` : '<span class="badge bg-secondary">Sin permisos</span>'}
            </td>
        </tr>
    `).join('');
}

function estadoBadge(estado) {
    if (estado === 'Pagada') return 'badge-estado-pagada';
    if (estado === 'Vencida') return 'badge-estado-vencida';
    return 'badge-estado-pendiente';
}

function confirmarEliminar(id) {
    idAEliminar = id;
    modalEliminar.show();
}
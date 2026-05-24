let idAEliminar = null;
let modalEliminar;
let modalDetalle;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
    modalDetalle = new bootstrap.Modal(document.getElementById('modalDetalle'));

    document.getElementById('navUsuario').textContent = usuario.username;

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`/actas/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Acta eliminada correctamente.', 'success');
            await cargar();
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar esta acta porque tiene datos asociados en el sistema.', 'error');
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
            <td class="d-flex gap-1">
                <button class="btn btn-outline-info btn-sm" onclick="verDetalle(${a.id})" title="Ver detalle">
                    <i class="bi bi-eye"></i>
                </button>
                ${esAdmin() ? `
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar(${a.id})" title="Eliminar">
                        <i class="bi bi-trash3"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

async function verDetalle(id) {
    try {
        const a = await api.get(`/actas/${id}`);

        document.getElementById('detalleActaId').textContent = a.id;
        document.getElementById('detalleEstado').innerHTML = `<span class="badge ${estadoBadge(a.estadoDelActa?.nombreEstadoActa)} px-2 py-1">${a.estadoDelActa?.nombreEstadoActa || '-'}</span>`;
        document.getElementById('detalleFecha').textContent = formatDate(a.fechaLabrado);
        document.getElementById('detalleHora').textContent = a.horaLabrado || '-';
        document.getElementById('detalleLugar').textContent = a.lugarConstatacion || '-';
        document.getElementById('detalleRuta').textContent = a.ruta ? a.ruta.nombre : '-';
        document.getElementById('detalleFechaVto').textContent = a.fechaVtoPagoVolun ? formatDate(a.fechaVtoPagoVolun) : '-';
        document.getElementById('detalleObservaciones').textContent = a.observaciones || '-';

        document.getElementById('detalleAutoridad').textContent = a.autoridad ? `${a.autoridad.nombre} ${a.autoridad.apellido}` : '-';
        document.getElementById('detalleOrganizacion').textContent = a.organizacionEstatal?.nombre || '-';

        document.getElementById('detalleConductor').textContent = a.licencia?.conductor ? `${a.licencia.conductor.nombre} ${a.licencia.conductor.apellido}` : '-';
        document.getElementById('detalleDni').textContent = a.licencia?.conductor?.dni || '-';
        document.getElementById('detalleLicencia').textContent = a.licencia ? `Clase ${a.licencia.clase} — Vto: ${formatDate(a.licencia.fechaVto)}` : '-';

        document.getElementById('detalleVehiculo').textContent = a.vehiculo?.dominio || '-';
        document.getElementById('detalleMarca').textContent = a.vehiculo?.marca?.nombre || '-';
        document.getElementById('detalleModelo').textContent = a.vehiculo?.modelo?.nombre || '-';

        const infraccionesHtml = a.infracciones?.length
            ? a.infracciones.map(inf => `
                <tr>
                    <td>${inf.tiposInfraccion?.map(t => `<span class="badge bg-secondary me-1">${t.codigo}</span> ${t.descripcion || ''}`).join('') || '-'}</td>
                    <td>${inf.descripcion || '-'}</td>
                    <td class="fw-semibold">$${inf.importe?.toLocaleString('es-AR') || '0'}</td>
                </tr>
            `).join('')
            : `<tr><td colspan="3" class="text-center text-muted">Sin infracciones registradas</td></tr>`;

        document.getElementById('detalleInfracciones').innerHTML = infraccionesHtml;

        const total = a.infracciones?.reduce((sum, inf) => sum + (inf.importe || 0), 0) || 0;
        document.getElementById('detalleTotal').textContent = `$${total.toLocaleString('es-AR')}`;

        modalDetalle.show();
    } catch {
        showAlert('alertContainer', 'Error al cargar el detalle del acta.', 'error');
    }
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
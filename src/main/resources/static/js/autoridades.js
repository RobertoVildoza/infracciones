let idAEliminar = null;
let modalForm, modalEliminar;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    if (!esAdmin()) {
        window.location.href = '/index.html';
        return;
    }

    modalForm = new bootstrap.Modal(document.getElementById('modalForm'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    if (!esAdmin()) {
        document.getElementById('btnNuevo')?.remove();
    }

    const organizaciones = await api.get('/organizaciones');
    const sel = document.getElementById('fOrganizacion');
    organizaciones.forEach(o => sel.innerHTML += `<option value="${o.id}">${o.nombre}</option>`);

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`/autoridades/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Autoridad eliminada correctamente.', 'success');
            await cargar();
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar esta autoridad porque tiene datos asociados en el sistema.', 'error');
        }
    });

    await cargar();
};

async function cargar() {
    const items = await api.get('/autoridades');
    const tbody = document.getElementById('tableBody');
    document.getElementById('totalBadge').textContent = `${items.length} registros`;

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox me-2"></i>No hay autoridades registradas
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map(a => {
        window[`_autoridad_${a.id}`] = a;
        return `
    <tr>
        <td>${a.id}</td>
        <td><span class="fw-semibold">${a.idLegajo}</span></td>
        <td>${a.idPlaca}</td>
        <td>${a.dni}</td>
        <td>${a.apellido}</td>
        <td>${a.nombre}</td>
        <td>${a.genero || '-'}</td>
        <td>${a.organizacionEstatal?.nombre || '-'}</td>
        <td>
            ${esAdmin() ? `
                <button class="btn btn-outline-secondary btn-sm me-1"
                    onclick="editar(window['_autoridad_${a.id}'])">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm"
                    onclick="confirmarEliminar(${a.id})">
                    <i class="bi bi-trash3"></i>
                </button>
            ` : '<span class="badge bg-secondary">Sin permisos</span>'}
        </td>
    </tr>`;
    }).join('');
}

function abrirModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-plus me-2"></i>Nueva Autoridad';
    document.getElementById('itemId').value = '';
    ['fLegajo','fPlaca','fDni','fNombre','fApellido'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fGenero').value = '';
    document.getElementById('fOrganizacion').value = '';
    modalForm.show();
}

function editar(a) {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Autoridad';
    document.getElementById('itemId').value = a.id;
    document.getElementById('fLegajo').value = a.idLegajo;
    document.getElementById('fPlaca').value = a.idPlaca;
    document.getElementById('fDni').value = a.dni;
    document.getElementById('fNombre').value = a.nombre;
    document.getElementById('fApellido').value = a.apellido;
    document.getElementById('fGenero').value = a.genero || '';
    document.getElementById('fOrganizacion').value = a.organizacionEstatal?.id || '';
    modalForm.show();
}

async function guardar() {
    const id = document.getElementById('itemId').value;
    const orgId = document.getElementById('fOrganizacion').value;
    const data = {
        idLegajo: parseInt(document.getElementById('fLegajo').value),
        idPlaca: parseInt(document.getElementById('fPlaca').value),
        dni: parseInt(document.getElementById('fDni').value),
        nombre: document.getElementById('fNombre').value,
        apellido: document.getElementById('fApellido').value,
        genero: document.getElementById('fGenero').value,
        organizacionEstatal: orgId ? { id: parseInt(orgId) } : null
    };
    try {
        if (id) await api.put(`/autoridades/${id}`, { id: parseInt(id), ...data });
        else await api.post('/autoridades', data);
        modalForm.hide();
        showAlert('alertContainer', 'Autoridad guardada correctamente.', 'success');
        await cargar();
    } catch {
        showAlert('alertContainer', 'Error al guardar.', 'error');
    }
}

function cerrarModal() { modalForm.hide(); }

function confirmarEliminar(id) {
    idAEliminar = id;
    modalEliminar.show();
}
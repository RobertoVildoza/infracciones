let idAEliminar = null;
let modalForm, modalEliminar;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalForm = new bootstrap.Modal(document.getElementById('modalForm'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    if (!esAdmin()) {
        window.location.href = '/index.html';
        return;
    }

    document.getElementById('navUsuario').textContent = usuario.username;

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
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar(${a.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                ` : '<span class="badge bg-secondary">Sin permisos</span>'}
            </td>
        </tr>`;
    }).join('');
}

function abrirModal() {
    limpiarTodosLosErrores();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-plus me-2"></i>Nueva Autoridad';
    document.getElementById('itemId').value = '';
    ['fLegajo','fPlaca','fDni','fNombre','fApellido'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fGenero').value = '';
    document.getElementById('fOrganizacion').value = '';
    modalForm.show();
}

function editar(a) {
    limpiarTodosLosErrores();
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

function validarAutoridad() {
    let valido = true;

    const legajo = document.getElementById('fLegajo').value.trim();
    if (!legajo) {
        mostrarError('fLegajo', 'El legajo es obligatorio.');
        valido = false;
    } else if (!/^\d+$/.test(legajo)) {
        mostrarError('fLegajo', 'El legajo solo puede contener números.');
        valido = false;
    } else {
        limpiarError('fLegajo');
    }

    const placa = document.getElementById('fPlaca').value.trim();
    if (!placa) {
        mostrarError('fPlaca', 'La placa es obligatoria.');
        valido = false;
    } else if (!/^\d+$/.test(placa)) {
        mostrarError('fPlaca', 'La placa solo puede contener números.');
        valido = false;
    } else {
        limpiarError('fPlaca');
    }

    const dni = document.getElementById('fDni').value.trim();
    if (!dni) {
        mostrarError('fDni', 'El DNI es obligatorio.');
        valido = false;
    } else if (!/^\d+$/.test(dni)) {
        mostrarError('fDni', 'El DNI solo puede contener números.');
        valido = false;
    } else {
        limpiarError('fDni');
    }

    const nombre = document.getElementById('fNombre').value.trim();
    if (!nombre) {
        mostrarError('fNombre', 'El nombre es obligatorio.');
        valido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarError('fNombre', 'El nombre solo puede contener letras.');
        valido = false;
    } else {
        limpiarError('fNombre');
    }

    const apellido = document.getElementById('fApellido').value.trim();
    if (!apellido) {
        mostrarError('fApellido', 'El apellido es obligatorio.');
        valido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
        mostrarError('fApellido', 'El apellido solo puede contener letras.');
        valido = false;
    } else {
        limpiarError('fApellido');
    }

    if (!document.getElementById('fOrganizacion').value) {
        mostrarError('fOrganizacion', 'Debe seleccionar una organización.');
        valido = false;
    } else {
        limpiarError('fOrganizacion');
    }

    return valido;
}

async function guardar() {
    if (!validarAutoridad()) return;

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

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    let feedback = input.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.appendChild(feedback);
    }
    feedback.textContent = mensaje;
}

function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = '';
}

function limpiarTodosLosErrores() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
}
let idAEliminar = null;
let modalForm, modalEliminar;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalForm = new bootstrap.Modal(document.getElementById('modalForm'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    if (!esAdmin()) {
        document.getElementById('btnNuevo')?.remove();
    }

    document.getElementById('navUsuario').textContent = usuario.username;

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`/conductores/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Conductor eliminado correctamente.', 'success');
            await cargar();
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar este conductor porque tiene datos asociados en el sistema.', 'error');
        }
    });

    await cargar();
};

async function cargar() {
    const items = await api.get('/conductores');
    const tbody = document.getElementById('tableBody');
    document.getElementById('totalBadge').textContent = `${items.length} registros`;

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox me-2"></i>No hay conductores registrados
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map(c => `
        <tr>
            <td>${c.id}</td>
            <td><span class="fw-semibold">${c.dni}</span></td>
            <td>${c.apellido}</td>
            <td>${c.nombre}</td>
            <td>${c.genero || '-'}</td>
            <td>${c.domicilio || '-'}</td>
            <td>
                ${esAdmin() ? `
                    <button class="btn btn-outline-secondary btn-sm me-1"
                        onclick="editar(${c.id},'${c.dni}','${c.nombre}','${c.apellido}','${c.genero||''}','${c.domicilio||''}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar(${c.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                ` : '<span class="badge bg-secondary">Sin permisos</span>'}
            </td>
        </tr>
    `).join('');
}

function abrirModal() {
    limpiarTodosLosErrores();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-plus me-2"></i>Nuevo Conductor';
    document.getElementById('itemId').value = '';
    ['fDni','fNombre','fApellido','fDomicilio'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fGenero').value = '';
    modalForm.show();
}

function editar(id, dni, nombre, apellido, genero, domicilio) {
    limpiarTodosLosErrores();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Conductor';
    document.getElementById('itemId').value = id;
    document.getElementById('fDni').value = dni;
    document.getElementById('fNombre').value = nombre;
    document.getElementById('fApellido').value = apellido;
    document.getElementById('fGenero').value = genero;
    document.getElementById('fDomicilio').value = domicilio;
    modalForm.show();
}

function validarConductor() {
    let valido = true;

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

    const domicilio = document.getElementById('fDomicilio').value.trim();
    if (domicilio && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.\,\-]+$/.test(domicilio)) {
        mostrarError('fDomicilio', 'El domicilio contiene caracteres no válidos.');
        valido = false;
    } else {
        limpiarError('fDomicilio');
    }

    return valido;
}

async function guardar() {
    if (!validarConductor()) return;

    const id = document.getElementById('itemId').value;
    const data = {
        dni: parseInt(document.getElementById('fDni').value),
        nombre: document.getElementById('fNombre').value,
        apellido: document.getElementById('fApellido').value,
        genero: document.getElementById('fGenero').value,
        domicilio: document.getElementById('fDomicilio').value
    };
    try {
        if (id) await api.put(`/conductores/${id}`, { id: parseInt(id), ...data });
        else await api.post('/conductores', data);
        modalForm.hide();
        showAlert('alertContainer', 'Conductor guardado correctamente.', 'success');
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
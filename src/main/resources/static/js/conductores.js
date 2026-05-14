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
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-plus me-2"></i>Nuevo Conductor';
    document.getElementById('itemId').value = '';
    ['fDni','fNombre','fApellido','fDomicilio'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fGenero').value = '';
    modalForm.show();
}

function editar(id, dni, nombre, apellido, genero, domicilio) {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Conductor';
    document.getElementById('itemId').value = id;
    document.getElementById('fDni').value = dni;
    document.getElementById('fNombre').value = nombre;
    document.getElementById('fApellido').value = apellido;
    document.getElementById('fGenero').value = genero;
    document.getElementById('fDomicilio').value = domicilio;
    modalForm.show();
}

async function guardar() {
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
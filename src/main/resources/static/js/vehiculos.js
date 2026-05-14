let idAEliminar = null;
let modalForm, modalEliminar;
let modalNuevaMarca, modalNuevoModelo;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalForm = new bootstrap.Modal(document.getElementById('modalForm'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    if (!esAdmin()) {
        document.getElementById('btnNuevo')?.remove();
    }

    const [marcas, modelos] = await Promise.all([
        api.get('/marcas'), api.get('/modelos')
    ]);

    const selM = document.getElementById('fMarca');
    const selMo = document.getElementById('fModelo');
    marcas.forEach(m => selM.innerHTML += `<option value="${m.id}">${m.nombre}</option>`);
    modelos.forEach(m => selMo.innerHTML += `<option value="${m.id}">${m.nombre}</option>`);

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`/vehiculos/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Vehículo eliminado correctamente.', 'success');
            await cargar();
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar este vehículo porque tiene datos asociados en el sistema.', 'error');
        }
    });

    await cargar();
};

async function cargar() {
    const items = await api.get('/vehiculos');
    const tbody = document.getElementById('tableBody');
    document.getElementById('totalBadge').textContent = `${items.length} registros`;

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox me-2"></i>No hay vehículos registrados
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map(v => {
        window[`_vehiculo_${v.id}`] = v;
        return `
        <tr>
            <td>${v.id}</td>
            <td><span class="fw-semibold">${v.dominio}</span></td>
            <td>${v.marca?.nombre || '-'}</td>
            <td>${v.modelo?.nombre || '-'}</td>
            <td>${v.color || '-'}</td>
            <td>${v.anioPatentamiento || '-'}</td>
            <td>
                ${esAdmin() ? `
                    <button class="btn btn-outline-secondary btn-sm me-1"
                        onclick="editar(window['_vehiculo_${v.id}'])">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar(${v.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                ` : '<span class="badge bg-secondary">Sin permisos</span>'}
            </td>
        </tr>`;
    }).join('');
}

function abrirModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-car-front me-2"></i>Nuevo Vehículo';
    document.getElementById('itemId').value = '';
    ['fDominio','fColor','fAnio'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fMarca').value = '';
    document.getElementById('fModelo').value = '';
    modalForm.show();
}

function editar(v) {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Vehículo';
    document.getElementById('itemId').value = v.id;
    document.getElementById('fDominio').value = v.dominio;
    document.getElementById('fColor').value = v.color || '';
    document.getElementById('fAnio').value = v.anioPatentamiento || '';
    document.getElementById('fMarca').value = v.marca?.id || '';
    document.getElementById('fModelo').value = v.modelo?.id || '';
    modalForm.show();
}

async function guardar() {
    const id = document.getElementById('itemId').value;
    const data = {
        dominio: document.getElementById('fDominio').value.toUpperCase(),
        color: document.getElementById('fColor').value,
        anioPatentamiento: parseInt(document.getElementById('fAnio').value) || null,
        marca: { id: parseInt(document.getElementById('fMarca').value) },
        modelo: { id: parseInt(document.getElementById('fModelo').value) }
    };
    try {
        if (id) await api.put(`/vehiculos/${id}`, { id: parseInt(id), ...data });
        else await api.post('/vehiculos', data);
        modalForm.hide();
        showAlert('alertContainer', 'Vehículo guardado correctamente.', 'success');
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

// MARCA Y MODELO DESDE VEHÍCULOS
function abrirModalNuevaMarca() {
    if (!modalNuevaMarca) modalNuevaMarca = new bootstrap.Modal(document.getElementById('modalNuevaMarca'));
    document.getElementById('nuevaMarcaNombre').value = '';
    modalNuevaMarca.show();
}

async function guardarNuevaMarca() {
    const nombre = document.getElementById('nuevaMarcaNombre').value.trim();
    if (!nombre) { showAlert('alertContainer', 'Ingrese un nombre para la marca.', 'error'); return; }
    try {
        const marca = await api.post('/marcas', { nombre });
        const sel = document.getElementById('fMarca');
        sel.innerHTML += `<option value="${marca.id}">${marca.nombre}</option>`;
        sel.value = marca.id;
        modalNuevaMarca.hide();
        showAlert('alertContainer', `Marca "${marca.nombre}" agregada correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar la marca. Puede que ya exista.', 'error');
    }
}

function abrirModalNuevoModelo() {
    if (!modalNuevoModelo) modalNuevoModelo = new bootstrap.Modal(document.getElementById('modalNuevoModelo'));
    document.getElementById('nuevoModeloNombre').value = '';
    modalNuevoModelo.show();
}

async function guardarNuevoModelo() {
    const nombre = document.getElementById('nuevoModeloNombre').value.trim();
    if (!nombre) { showAlert('alertContainer', 'Ingrese un nombre para el modelo.', 'error'); return; }
    try {
        const modelo = await api.post('/modelos', { nombre });
        const sel = document.getElementById('fModelo');
        sel.innerHTML += `<option value="${modelo.id}">${modelo.nombre}</option>`;
        sel.value = modelo.id;
        modalNuevoModelo.hide();
        showAlert('alertContainer', `Modelo "${modelo.nombre}" agregado correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar el modelo. Puede que ya exista.', 'error');
    }
}
let idAEliminar = null;
let modalForm, modalEliminar;
let modalNuevaMarca, modalNuevoModelo;

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    modalForm = new bootstrap.Modal(document.getElementById('modalForm'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    document.getElementById('navUsuario').textContent = usuario.username;

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
    limpiarTodosLosErrores();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-car-front me-2"></i>Nuevo Vehículo';
    document.getElementById('itemId').value = '';
    ['fDominio','fColor','fAnio'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fMarca').value = '';
    document.getElementById('fModelo').value = '';
    modalForm.show();
}

function editar(v) {
    limpiarTodosLosErrores();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Vehículo';
    document.getElementById('itemId').value = v.id;
    document.getElementById('fDominio').value = v.dominio;
    document.getElementById('fColor').value = v.color || '';
    document.getElementById('fAnio').value = v.anioPatentamiento || '';
    document.getElementById('fMarca').value = v.marca?.id || '';
    document.getElementById('fModelo').value = v.modelo?.id || '';
    modalForm.show();
}

function validarVehiculo() {
    let valido = true;

    const dominio = document.getElementById('fDominio').value.trim();
    if (!dominio) {
        mostrarError('fDominio', 'El dominio es obligatorio.');
        valido = false;
    } else if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(dominio)) {
        mostrarError('fDominio', 'El dominio debe contener al menos una letra (Ej: ABC123).');
        valido = false;
    } else {
        limpiarError('fDominio');
    }

    const color = document.getElementById('fColor').value.trim();
    if (color && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(color)) {
        mostrarError('fColor', 'El color solo puede contener letras.');
        valido = false;
    } else {
        limpiarError('fColor');
    }

    const anio = document.getElementById('fAnio').value.trim();
    const anioActual = new Date().getFullYear();
    if (anio && (!/^\d{4}$/.test(anio) || parseInt(anio) < 1900 || parseInt(anio) > anioActual)) {
        mostrarError('fAnio', `El año debe estar entre 1900 y ${anioActual}.`);
        valido = false;
    } else {
        limpiarError('fAnio');
    }

    if (!document.getElementById('fMarca').value) {
        mostrarError('fMarca', 'Debe seleccionar una marca.');
        valido = false;
    } else {
        limpiarError('fMarca');
    }

    if (!document.getElementById('fModelo').value) {
        mostrarError('fModelo', 'Debe seleccionar un modelo.');
        valido = false;
    } else {
        limpiarError('fModelo');
    }

    return valido;
}

async function guardar() {
    if (!validarVehiculo()) return;

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

// MARCA
function abrirModalNuevaMarca() {
    if (!modalNuevaMarca) modalNuevaMarca = new bootstrap.Modal(document.getElementById('modalNuevaMarca'));
    document.getElementById('nuevaMarcaNombre').value = '';
    modalNuevaMarca.show();
}

async function guardarNuevaMarca() {
    const nombre = document.getElementById('nuevaMarcaNombre').value.trim();
    if (!nombre) {
        showAlert('alertContainer', 'Ingrese un nombre para la marca.', 'error');
        return;
    }
    if (!/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(nombre)) {
        showAlert('alertContainer', 'El nombre de la Marca solo puede contener letras, números y espacios, y debe incluir al menos una letra.', 'error');
        return;
    }
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

// MODELO
function abrirModalNuevoModelo() {
    if (!modalNuevoModelo) modalNuevoModelo = new bootstrap.Modal(document.getElementById('modalNuevoModelo'));
    document.getElementById('nuevoModeloNombre').value = '';
    modalNuevoModelo.show();
}

async function guardarNuevoModelo() {
    const nombre = document.getElementById('nuevoModeloNombre').value.trim();
    if (!nombre) {
        showAlert('alertContainer', 'Ingrese un nombre para el modelo.', 'error');
        return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(nombre)) {
        showAlert('alertContainer', 'El nombre del modelo contiene caracteres no válidos.', 'error');
        return;
    }
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

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    let feedback = document.getElementById(`${inputId}-feedback`)
        || input.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.appendChild(feedback);
    }
    feedback.textContent = mensaje;
    feedback.style.display = 'block';
}

function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = document.getElementById(`${inputId}-feedback`)
        || input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.style.display = 'none';
    }
}

function limpiarTodosLosErrores() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
}
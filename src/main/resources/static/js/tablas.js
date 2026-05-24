let tabActual = 'marcas';
let idAEliminar = null;
let endpointAEliminar = null;
let modalSimple, modalRuta, modalEstado, modalTipoInf, modalEliminar;
let msEndpoint = '';

const tabConfig = {
    marcas:         { titulo: '<i class="bi bi-tag me-2"></i>Marcas de Vehículos',          endpoint: '/marcas',          tipo: 'simple' },
    modelos:        { titulo: '<i class="bi bi-tag me-2"></i>Modelos de Vehículos',         endpoint: '/modelos',         tipo: 'simple' },
    tipoRutas:      { titulo: '<i class="bi bi-signpost me-2"></i>Tipos de Ruta',           endpoint: '/tipo-rutas',      tipo: 'simple' },
    rutas:          { titulo: '<i class="bi bi-signpost-2 me-2"></i>Rutas',                 endpoint: '/rutas',           tipo: 'ruta'   },
    organizaciones: { titulo: '<i class="bi bi-building me-2"></i>Organizaciones Estatales',endpoint: '/organizaciones',  tipo: 'simple' },
    estadosActa:    { titulo: '<i class="bi bi-flag me-2"></i>Estados del Acta',            endpoint: '/estados-acta',    tipo: 'estado' },
    tiposInfraccion:{ titulo: '<i class="bi bi-exclamation-triangle me-2"></i>Tipos de Infracción', endpoint: '/tipos-infraccion', tipo: 'tipoInf' }
};

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    document.getElementById('navUsuario').textContent = usuario.username;

    if (!esAdmin()) {
        document.getElementById('btnNuevo').style.display = 'none';
    }

    modalSimple  = new bootstrap.Modal(document.getElementById('modalSimple'));
    modalRuta    = new bootstrap.Modal(document.getElementById('modalRuta'));
    modalEstado  = new bootstrap.Modal(document.getElementById('modalEstado'));
    modalTipoInf = new bootstrap.Modal(document.getElementById('modalTipoInf'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            await api.delete(`${endpointAEliminar}/${idAEliminar}`);
            modalEliminar.hide();
            showAlert('alertContainer', 'Registro eliminado correctamente.', 'success');
            await cargarTab(tabActual);
        } catch {
            modalEliminar.hide();
            showAlert('alertContainer', 'No se puede eliminar este registro porque está siendo utilizado por otros datos del sistema.', 'error');
        }
    });

    await cargarTab('marcas');
};

function cambiarTab(tab, btn) {
    tabActual = tab;
    document.querySelectorAll('#tabsAuxiliares .nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tabTitle').innerHTML = tabConfig[tab].titulo;

    if (!esAdmin()) {
        document.getElementById('btnNuevo').style.display = 'none';
    } else {
        document.getElementById('btnNuevo').style.display = 'inline-block';
    }

    cargarTab(tab);
}

async function cargarTab(tab) {
    const config = tabConfig[tab];
    const data = await api.get(config.endpoint);
    document.getElementById('totalBadge').textContent = `${data.length} registros`;
    renderTab(tab, data, config.endpoint);
}

function renderTab(tab, data, endpoint) {
    const thead = document.getElementById('tablaHead');
    const tbody = document.getElementById('tablaBody');

    if (!data.length) {
        thead.innerHTML = '';
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox me-2"></i>No hay registros
                </td>
            </tr>`;
        return;
    }

    const btnAcciones = (editarFn, eliminarFn) => esAdmin() ? `
        <button class="btn btn-outline-secondary btn-sm me-1" onclick="${editarFn}">
            <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="${eliminarFn}">
            <i class="bi bi-trash3"></i>
        </button>
    ` : '<span class="badge bg-secondary">Sin permisos</span>';

    if (tab === 'rutas') {
        thead.innerHTML = '<tr><th>#</th><th>Nombre</th><th>Kilómetro</th><th>Tipo</th><th>Acciones</th></tr>';
        tbody.innerHTML = data.map(r => {
            window[`_ruta_${r.id}`] = r;
            return `
            <tr>
                <td>${r.id}</td>
                <td><span class="fw-semibold">${r.nombre}</span></td>
                <td>${r.kilometro || '-'}</td>
                <td>${r.tipoRuta?.nombre || '-'}</td>
                <td>${btnAcciones(
                `editarRuta(window['_ruta_${r.id}'])`,
                `confirmarEliminar(${r.id}, '/rutas')`
            )}</td>
            </tr>`;
        }).join('');

    } else if (tab === 'estadosActa') {
        thead.innerHTML = '<tr><th>#</th><th>Estado</th><th>Acciones</th></tr>';
        tbody.innerHTML = data.map(e => `
            <tr>
                <td>${e.id}</td>
                <td><span class="fw-semibold">${e.nombreEstadoActa}</span></td>
                <td>${btnAcciones(
            `editarEstado(${e.id}, '${e.nombreEstadoActa}')`,
            `confirmarEliminar(${e.id}, '/estados-acta')`
        )}</td>
            </tr>`).join('');

    } else if (tab === 'tiposInfraccion') {
        thead.innerHTML = '<tr><th>#</th><th>Código</th><th>Descripción</th><th>Acciones</th></tr>';
        tbody.innerHTML = data.map(t => {
            window[`_tipo_${t.id}`] = t;
            return `
            <tr>
                <td>${t.id}</td>
                <td><span class="badge bg-dark">${t.codigo}</span></td>
                <td>${t.descripcion}</td>
                <td>${btnAcciones(
                `editarTipoInfraccion(window['_tipo_${t.id}'])`,
                `confirmarEliminar(${t.id}, '/tipos-infraccion')`
            )}</td>
            </tr>`;
        }).join('');

    } else {
        thead.innerHTML = '<tr><th>#</th><th>Nombre</th><th>Acciones</th></tr>';
        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><span class="fw-semibold">${item.nombre}</span></td>
                <td>${btnAcciones(
            `abrirModalSimple('${endpoint}', ${item.id}, '${item.nombre}')`,
            `confirmarEliminar(${item.id}, '${endpoint}')`
        )}</td>
            </tr>`).join('');
    }
}

// MODAL SIMPLE
function abrirModal() {
    const config = tabConfig[tabActual];
    if (config.tipo === 'simple') abrirModalSimple(config.endpoint);
    else if (config.tipo === 'ruta') abrirModalRuta();
    else if (config.tipo === 'estado') abrirModalEstado();
    else if (config.tipo === 'tipoInf') abrirModalTipoInfraccion();
}

function abrirModalSimple(endpoint, id = '', nombre = '') {
    msEndpoint = endpoint;
    limpiarTodosLosErrores();
    document.getElementById('modalSimpleTitle').textContent = id ? 'Editar Registro' : 'Nuevo Registro';
    document.getElementById('msId').value = id;
    document.getElementById('msNombre').value = nombre;
    modalSimple.show();
}

async function guardarSimple() {
    const nombre = document.getElementById('msNombre').value.trim();
    if (!nombre) {
        mostrarError('msNombre', 'El nombre es obligatorio.');
        return;
    }

    // Tipos de ruta y organizaciones: solo letras
    // Marcas y modelos: letras y números
    const soloLetras = ['/tipo-rutas', '/organizaciones', '/estados-acta'];
    if (soloLetras.includes(msEndpoint)) {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/.test(nombre)) {
            mostrarError('msNombre', 'El nombre solo puede contener letras.');
            return;
        }
    } else {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/.test(nombre)) {
            mostrarError('msNombre', 'El nombre contiene caracteres no válidos.');
            return;
        }
    }

    limpiarError('msNombre');
    const id = document.getElementById('msId').value;
    try {
        if (id) await api.put(`${msEndpoint}/${id}`, { id: parseInt(id), nombre });
        else await api.post(msEndpoint, { nombre });
        modalSimple.hide();
        showAlert('alertContainer', 'Guardado correctamente.', 'success');
        await cargarTab(tabActual);
    } catch {
        showAlert('alertContainer', 'Error al guardar.', 'error');
    }
}

// MODAL RUTA
async function abrirModalRuta(r = null) {
    limpiarTodosLosErrores();
    const tiposRuta = await api.get('/tipo-rutas');
    const sel = document.getElementById('mrTipo');
    sel.innerHTML = '<option value="">Seleccionar...</option>';
    tiposRuta.forEach(t => sel.innerHTML += `<option value="${t.id}">${t.nombre}</option>`);
    document.getElementById('modalRutaTitle').textContent = r ? 'Editar Ruta' : 'Nueva Ruta';
    document.getElementById('mrId').value = r?.id || '';
    document.getElementById('mrNombre').value = r?.nombre || '';
    document.getElementById('mrKm').value = r?.kilometro || '';
    document.getElementById('mrTipo').value = r?.tipoRuta?.id || '';
    modalRuta.show();
}

function editarRuta(r) { abrirModalRuta(r); }

async function guardarRuta() {
    let valido = true;

    const nombre = document.getElementById('mrNombre').value.trim();
    if (!nombre) {
        mostrarError('mrNombre', 'El nombre es obligatorio.');
        valido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/.test(nombre)) {
        // Solo letras para nombre de ruta
        mostrarError('mrNombre', 'El nombre solo puede contener letras.');
        valido = false;
    } else {
        limpiarError('mrNombre');
    }

    const km = document.getElementById('mrKm').value.trim();
    if (km && !/^[a-zA-Z0-9\s]+$/.test(km)) {
        mostrarError('mrKm', 'El kilómetro contiene caracteres no válidos.');
        valido = false;
    } else {
        limpiarError('mrKm');
    }

    if (!document.getElementById('mrTipo').value) {
        mostrarError('mrTipo', 'Debe seleccionar un tipo de ruta.');
        valido = false;
    } else {
        limpiarError('mrTipo');
    }

    if (!valido) return;

    const id = document.getElementById('mrId').value;
    const data = {
        nombre,
        kilometro: km,
        tipoRuta: { id: parseInt(document.getElementById('mrTipo').value) }
    };
    try {
        if (id) await api.put(`/rutas/${id}`, { id: parseInt(id), ...data });
        else await api.post('/rutas', data);
        modalRuta.hide();
        showAlert('alertContainer', 'Ruta guardada correctamente.', 'success');
        await cargarTab('rutas');
    } catch {
        showAlert('alertContainer', 'Error al guardar.', 'error');
    }
}

// MODAL ESTADO
function abrirModalEstado(id = '', nombre = '') {
    limpiarTodosLosErrores();
    document.getElementById('modalEstadoTitle').textContent = id ? 'Editar Estado' : 'Nuevo Estado';
    document.getElementById('meId').value = id;
    document.getElementById('meNombre').value = nombre;
    modalEstado.show();
}

function editarEstado(id, nombre) { abrirModalEstado(id, nombre); }

async function guardarEstado() {
    const nombreEstadoActa = document.getElementById('meNombre').value.trim();
    if (!nombreEstadoActa) {
        mostrarError('meNombre', 'El nombre del estado es obligatorio.');
        return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreEstadoActa)) {
        mostrarError('meNombre', 'El nombre solo puede contener letras.');
        return;
    }
    limpiarError('meNombre');
    const id = document.getElementById('meId').value;
    try {
        if (id) await api.put(`/estados-acta/${id}`, { id: parseInt(id), nombreEstadoActa });
        else await api.post('/estados-acta', { nombreEstadoActa });
        modalEstado.hide();
        showAlert('alertContainer', 'Estado guardado correctamente.', 'success');
        await cargarTab('estadosActa');
    } catch {
        showAlert('alertContainer', 'Error al guardar.', 'error');
    }
}

// MODAL TIPO INFRACCIÓN
function abrirModalTipoInfraccion(t = null) {
    limpiarTodosLosErrores();
    document.getElementById('modalTipoInfTitle').textContent = t ? 'Editar Tipo de Infracción' : 'Nuevo Tipo de Infracción';
    document.getElementById('mtiId').value = t?.id || '';
    document.getElementById('mtiCodigo').value = t?.codigo || '';
    document.getElementById('mtiDesc').value = t?.descripcion || '';
    modalTipoInf.show();
}

function editarTipoInfraccion(t) { abrirModalTipoInfraccion(t); }

async function guardarTipoInfraccion() {
    let valido = true;

    const codigo = document.getElementById('mtiCodigo').value.trim();
    if (!codigo) {
        mostrarError('mtiCodigo', 'El código es obligatorio.');
        valido = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(codigo)) {
        mostrarError('mtiCodigo', 'El código solo puede contener letras y números sin espacios.');
        valido = false;
    } else {
        limpiarError('mtiCodigo');
    }

    const descripcion = document.getElementById('mtiDesc').value.trim();
    if (!descripcion) {
        mostrarError('mtiDesc', 'La descripción es obligatoria.');
        valido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/.test(descripcion)) {
        // Letras, números, espacios, guiones y puntos para descripciones
        mostrarError('mtiDesc', 'La descripción contiene caracteres no válidos.');
        valido = false;
    } else {
        limpiarError('mtiDesc');
    }

    if (!valido) return;

    const id = document.getElementById('mtiId').value;
    const data = { codigo, descripcion };
    try {
        if (id) await api.put(`/tipos-infraccion/${id}`, { id: parseInt(id), ...data });
        else await api.post('/tipos-infraccion', data);
        modalTipoInf.hide();
        showAlert('alertContainer', 'Tipo de infracción guardado.', 'success');
        await cargarTab('tiposInfraccion');
    } catch {
        showAlert('alertContainer', 'Error al guardar.', 'error');
    }
}

// ELIMINAR
function confirmarEliminar(id, endpoint) {
    idAEliminar = id;
    endpointAEliminar = endpoint;
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
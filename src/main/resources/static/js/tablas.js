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
        tbody.innerHTML = data.map((r, idx) => {
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
    document.getElementById('modalSimpleTitle').textContent = id ? 'Editar Registro' : 'Nuevo Registro';
    document.getElementById('msId').value = id;
    document.getElementById('msNombre').value = nombre;
    modalSimple.show();
}

async function guardarSimple() {
    const id = document.getElementById('msId').value;
    const nombre = document.getElementById('msNombre').value;
    try {
        if (id) await api.put(`${msEndpoint}/${id}`, { id: parseInt(id), nombre });
        else await api.post(msEndpoint, { nombre });
        modalSimple.hide();
        showAlert('alertContainer', 'Guardado correctamente.', 'success');
        await cargarTab(tabActual);
    } catch { showAlert('alertContainer', 'Error al guardar.', 'error'); }
}

// MODAL RUTA
async function abrirModalRuta(r = null) {
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
    const id = document.getElementById('mrId').value;
    const data = {
        nombre: document.getElementById('mrNombre').value,
        kilometro: document.getElementById('mrKm').value,
        tipoRuta: { id: parseInt(document.getElementById('mrTipo').value) }
    };
    try {
        if (id) await api.put(`/rutas/${id}`, { id: parseInt(id), ...data });
        else await api.post('/rutas', data);
        modalRuta.hide();
        showAlert('alertContainer', 'Ruta guardada correctamente.', 'success');
        await cargarTab('rutas');
    } catch { showAlert('alertContainer', 'Error al guardar.', 'error'); }
}

// MODAL ESTADO
function abrirModalEstado(id = '', nombre = '') {
    document.getElementById('modalEstadoTitle').textContent = id ? 'Editar Estado' : 'Nuevo Estado';
    document.getElementById('meId').value = id;
    document.getElementById('meNombre').value = nombre;
    modalEstado.show();
}

function editarEstado(id, nombre) { abrirModalEstado(id, nombre); }

async function guardarEstado() {
    const id = document.getElementById('meId').value;
    const nombreEstadoActa = document.getElementById('meNombre').value;
    try {
        if (id) await api.put(`/estados-acta/${id}`, { id: parseInt(id), nombreEstadoActa });
        else await api.post('/estados-acta', { nombreEstadoActa });
        modalEstado.hide();
        showAlert('alertContainer', 'Estado guardado correctamente.', 'success');
        await cargarTab('estadosActa');
    } catch { showAlert('alertContainer', 'Error al guardar.', 'error'); }
}

// MODAL TIPO INFRACCIÓN
function abrirModalTipoInfraccion(t = null) {
    document.getElementById('modalTipoInfTitle').textContent = t ? 'Editar Tipo de Infracción' : 'Nuevo Tipo de Infracción';
    document.getElementById('mtiId').value = t?.id || '';
    document.getElementById('mtiCodigo').value = t?.codigo || '';
    document.getElementById('mtiDesc').value = t?.descripcion || '';
    modalTipoInf.show();
}

function editarTipoInfraccion(t) { abrirModalTipoInfraccion(t); }

async function guardarTipoInfraccion() {
    const id = document.getElementById('mtiId').value;
    const data = {
        codigo: document.getElementById('mtiCodigo').value,
        descripcion: document.getElementById('mtiDesc').value
    };
    try {
        if (id) await api.put(`/tipos-infraccion/${id}`, { id: parseInt(id), ...data });
        else await api.post('/tipos-infraccion', data);
        modalTipoInf.hide();
        showAlert('alertContainer', 'Tipo de infracción guardado.', 'success');
        await cargarTab('tiposInfraccion');
    } catch { showAlert('alertContainer', 'Error al guardar.', 'error'); }
}

// ELIMINAR
function confirmarEliminar(id, endpoint) {
    idAEliminar = id;
    endpointAEliminar = endpoint;
    modalEliminar.show();
}
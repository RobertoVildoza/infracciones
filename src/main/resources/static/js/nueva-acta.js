let infraccionCount = 0;
let tiposInfraccion = [];

window.onload = async () => {
    const usuario = await verificarSesion();
    if (!usuario) return;

    await cargarMarcas();
    await cargarModelos();
    await cargarRutas();
    await cargarTiposInfraccion();

    const now = new Date();
    document.getElementById('actaFecha').value = now.toISOString().split('T')[0];
    document.getElementById('actaHora').value = now.toTimeString().slice(0, 5);

    // Si el usuario tiene autoridad ligada, autocompletar
    const autoridad = getAutoridadUsuario();
    if (autoridad) {
        document.getElementById('autoridadId').value = autoridad.id;
        document.getElementById('autoridadNombre').value = autoridad.nombre;
        document.getElementById('autoridadApellido').value = autoridad.apellido;
        document.getElementById('autoridadDni').value = autoridad.dni;
        document.getElementById('autoridadOrganizacion').value = autoridad.organizacionNombre || '-';
        document.getElementById('organizacionId').value = autoridad.organizacionId || '';
        document.getElementById('legajoBuscar').value = autoridad.idLegajo;

        // Si es autoridad bloquear la sección
        if (!esAdmin()) {
            document.getElementById('legajoBuscar').readOnly = true;
            document.querySelector('button[onclick="buscarAutoridad()"]').disabled = true;
        }
    }
};

async function cargarMarcas() {
    const marcas = await api.get('/marcas');
    const sel = document.getElementById('vehiculoMarca');
    marcas.forEach(m => sel.innerHTML += `<option value="${m.id}">${m.nombre}</option>`);
}

async function cargarModelos() {
    const modelos = await api.get('/modelos');
    const sel = document.getElementById('vehiculoModelo');
    modelos.forEach(m => sel.innerHTML += `<option value="${m.id}">${m.nombre}</option>`);
}

async function cargarRutas() {
    const rutas = await api.get('/rutas');
    const sel = document.getElementById('actaRuta');
    rutas.forEach(r => sel.innerHTML += `<option value="${r.id}">${r.nombre} - ${r.kilometro || ''}</option>`);

    // Cargar tipos de ruta para el modal
    const tiposRuta = await api.get('/tipo-rutas');
    const selTipo = document.getElementById('nuevaRutaTipo');
    tiposRuta.forEach(t => selTipo.innerHTML += `<option value="${t.id}">${t.nombre}</option>`);
}

async function cargarTiposInfraccion() {
    tiposInfraccion = await api.get('/tipos-infraccion');
}

// AUTORIDAD
async function buscarAutoridad() {
    const legajo = document.getElementById('legajoBuscar').value;
    if (!legajo) { showAlert('alertAutoridad', 'Ingrese un número de legajo.', 'error'); return; }
    try {
        const autoridad = await api.get(`/autoridades/legajo/${legajo}`);
        document.getElementById('autoridadId').value = autoridad.id;
        document.getElementById('autoridadNombre').value = autoridad.nombre;
        document.getElementById('autoridadApellido').value = autoridad.apellido;
        document.getElementById('autoridadDni').value = autoridad.dni;
        document.getElementById('autoridadOrganizacion').value = autoridad.organizacionEstatal?.nombre || '-';
        document.getElementById('organizacionId').value = autoridad.organizacionEstatal?.id || '';
        showAlert('alertAutoridad', `Autoridad encontrada: ${autoridad.nombre} ${autoridad.apellido}`, 'success');
    } catch {
        showAlert('alertAutoridad', 'No se encontró ninguna autoridad con ese legajo.', 'error');
        ['autoridadId','autoridadNombre','autoridadApellido','autoridadDni','autoridadOrganizacion','organizacionId']
            .forEach(id => document.getElementById(id).value = '');
    }
}

// CONDUCTOR
async function buscarConductor() {
    const dni = document.getElementById('conductorDniBuscar').value;
    if (!dni) { showAlert('alertConductor', 'Ingrese un DNI.', 'error'); return; }
    try {
        const conductor = await api.get(`/conductores/dni/${dni}`);
        document.getElementById('conductorId').value = conductor.id;
        document.getElementById('conductorDni').value = conductor.dni;
        document.getElementById('conductorNombre').value = conductor.nombre;
        document.getElementById('conductorApellido').value = conductor.apellido;
        document.getElementById('conductorGenero').value = conductor.genero || '';
        document.getElementById('conductorDomicilio').value = conductor.domicilio || '';
        showAlert('alertConductor', `Conductor encontrado: ${conductor.nombre} ${conductor.apellido}`, 'success');
        await cargarLicencias(conductor.id);
    } catch {
        showAlert('alertConductor', 'Conductor no encontrado. Complete los datos para registrarlo.', 'warning');
        document.getElementById('conductorId').value = '';
        document.getElementById('conductorDni').value = dni;
        ['conductorNombre','conductorApellido','conductorDomicilio'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('conductorGenero').value = '';
        document.getElementById('licenciaId').value = '';
    }
}

async function cargarLicencias(conductorId) {
    try {
        const licencias = await api.get(`/licencias/conductor/${conductorId}`);
        if (licencias.length > 0) {
            const lic = licencias[0];
            document.getElementById('licenciaId').value = lic.id;
            document.getElementById('licenciaClase').value = lic.clase;
            document.getElementById('licenciaFechaVto').value = lic.fechaVto;
            showAlert('alertLicencia', `Licencia clase ${lic.clase} cargada. Vencimiento: ${formatDate(lic.fechaVto)}`, 'info');
        } else {
            showAlert('alertLicencia', 'El conductor no tiene licencias registradas. Complete los datos.', 'warning');
        }
    } catch {
        showAlert('alertLicencia', 'Error al cargar licencias.', 'error');
    }
}

// VEHÍCULO
async function buscarVehiculo() {
    const dominio = document.getElementById('dominioBuscar').value.toUpperCase();
    if (!dominio) { showAlert('alertVehiculo', 'Ingrese un dominio.', 'error'); return; }
    try {
        const vehiculo = await api.get(`/vehiculos/dominio/${dominio}`);
        document.getElementById('vehiculoId').value = vehiculo.id;
        document.getElementById('vehiculoDominio').value = vehiculo.dominio;
        document.getElementById('vehiculoColor').value = vehiculo.color || '';
        document.getElementById('vehiculoAnio').value = vehiculo.anioPatentamiento || '';
        document.getElementById('vehiculoMarca').value = vehiculo.marca?.id || '';
        document.getElementById('vehiculoModelo').value = vehiculo.modelo?.id || '';
        showAlert('alertVehiculo', `Vehículo encontrado: ${vehiculo.marca?.nombre} ${vehiculo.modelo?.nombre} — ${vehiculo.dominio}`, 'success');
    } catch {
        showAlert('alertVehiculo', 'Vehículo no encontrado. Complete los datos para registrarlo.', 'warning');
        document.getElementById('vehiculoId').value = '';
        document.getElementById('vehiculoDominio').value = dominio;
        ['vehiculoColor','vehiculoAnio'].forEach(id => document.getElementById(id).value = '');
    }
}

// INFRACCIONES
function agregarInfraccion() {
    document.getElementById('sinInfracciones')?.remove();
    const id = ++infraccionCount;
    const opciones = tiposInfraccion.map(t =>
        `<option value="${t.id}">${t.codigo} — ${t.descripcion}</option>`
    ).join('');

    const div = document.createElement('div');
    div.className = 'infraccion-item';
    div.id = `infraccion-${id}`;
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-dark">Infracción #${id}</span>
            <button class="btn btn-outline-danger btn-sm" onclick="eliminarInfraccion(${id})">
                <i class="bi bi-trash3"></i>
            </button>
        </div>
        <div class="row g-3">
            <div class="col-md-5">
                <label class="form-label">Tipo de Infracción *</label>
                <div class="input-group input-group-sm">
                    <select class="form-select form-select-sm" id="infTipo-${id}">
                        <option value="">Seleccionar...</option>
                        ${opciones}
                    </select>
                    <button class="btn btn-outline-secondary btn-sm" type="button"
                        onclick="abrirModalNuevoTipo(${id})" title="Agregar nuevo tipo">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label">Importe *</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" id="infImporte-${id}"
                        placeholder="0.00" step="0.01">
                </div>
            </div>
            <div class="col-md-12">
                <label class="form-label">Descripción adicional</label>
                <textarea class="form-control form-control-sm" id="infDesc-${id}" rows="2"
                    placeholder="Descripción adicional de la infracción..."></textarea>
            </div>
        </div>
    `;
    document.getElementById('infraccionesList').appendChild(div);
}

function eliminarInfraccion(id) {
    document.getElementById(`infraccion-${id}`).remove();
    if (!document.querySelector('.infraccion-item')) {
        const p = document.createElement('p');
        p.id = 'sinInfracciones';
        p.className = 'text-muted text-center py-2';
        p.style.fontSize = '0.85rem';
        p.innerHTML = '<i class="bi bi-info-circle me-1"></i> No hay infracciones agregadas';
        document.getElementById('infraccionesList').appendChild(p);
    }
}

// VALIDAR FORMULARIO
function validarFormulario() {
    const errores = [];

    // Autoridad
    if (!document.getElementById('autoridadId').value) {
        errores.push('Debe buscar y seleccionar una autoridad de constatación.');
    }

    // Conductor
    if (!document.getElementById('conductorDni').value) {
        errores.push('El conductor debe tener DNI.');
    }
    if (!document.getElementById('conductorNombre').value.trim()) {
        errores.push('El conductor debe tener nombre.');
    }
    if (!document.getElementById('conductorApellido').value.trim()) {
        errores.push('El conductor debe tener apellido.');
    }

    // Licencia
    if (!document.getElementById('licenciaClase').value) {
        errores.push('Debe seleccionar la clase de licencia del conductor.');
    }
    if (!document.getElementById('licenciaFechaVto').value) {
        errores.push('Debe ingresar la fecha de vencimiento de la licencia.');
    }

    // Vehículo
    if (!document.getElementById('vehiculoDominio').value.trim()) {
        errores.push('El vehículo debe tener dominio.');
    }
    if (!document.getElementById('vehiculoMarca').value) {
        errores.push('El vehículo debe tener marca.');
    }
    if (!document.getElementById('vehiculoModelo').value) {
        errores.push('El vehículo debe tener modelo.');
    }

    // Datos del acta
    if (!document.getElementById('actaFecha').value) {
        errores.push('Debe ingresar la fecha del acta.');
    }
    if (!document.getElementById('actaHora').value) {
        errores.push('Debe ingresar la hora del acta.');
    }
    if (!document.getElementById('organizacionId').value) {
        errores.push('La autoridad debe tener una organización asociada.');
    }

    // Ruta
    if (document.getElementById('toggleRuta').checked) {
        if (!document.getElementById('actaRuta').value) {
            errores.push('Debe seleccionar una ruta.');
        }
    }

    // Infracciones
    let infraccionesValidas = 0;
    for (let i = 1; i <= infraccionCount; i++) {
        const el = document.getElementById(`infraccion-${i}`);
        if (!el) continue;
        const tipo = document.getElementById(`infTipo-${i}`).value;
        const importe = document.getElementById(`infImporte-${i}`).value;
        if (!tipo) {
            errores.push(`Infracción #${i}: debe seleccionar el tipo de infracción.`);
        }
        if (!importe || parseFloat(importe) <= 0) {
            errores.push(`Infracción #${i}: el importe debe ser mayor a 0.`);
        }
        if (tipo && importe && parseFloat(importe) > 0) {
            infraccionesValidas++;
        }
    }
    if (infraccionesValidas === 0) {
        errores.push('Debe agregar al menos una infracción válida.');
    }

    // Mostrar errores
    if (errores.length > 0) {
        const lista = errores.map(e => `<li>${e}</li>`).join('');
        const container = document.getElementById('alertContainer');
        container.innerHTML = `
            <div class="alert alert-danger">
                <strong><i class="bi bi-exclamation-triangle me-2"></i>Por favor corrija los siguientes errores:</strong>
                <ul class="mb-0 mt-2">${lista}</ul>
            </div>`;
        container.scrollIntoView({ behavior: 'smooth' });
        return false;
    }

    return true;
}

// GUARDAR ACTA
async function guardarActa() {
    if (!validarFormulario()) return;

    try {
        let conductorId = document.getElementById('conductorId').value;
        if (!conductorId) {
            const conductor = await api.post('/conductores', {
                dni: parseInt(document.getElementById('conductorDni').value),
                nombre: document.getElementById('conductorNombre').value,
                apellido: document.getElementById('conductorApellido').value,
                genero: document.getElementById('conductorGenero').value,
                domicilio: document.getElementById('conductorDomicilio').value
            });
            conductorId = conductor.id;
        }

        let licenciaId = document.getElementById('licenciaId').value;
        if (!licenciaId) {
            const licencia = await api.post('/licencias', {
                clase: document.getElementById('licenciaClase').value,
                fechaVto: document.getElementById('licenciaFechaVto').value,
                conductor: { id: conductorId }
            });
            licenciaId = licencia.id;
        }

        let vehiculoId = document.getElementById('vehiculoId').value;
        if (!vehiculoId) {
            const vehiculo = await api.post('/vehiculos', {
                dominio: document.getElementById('vehiculoDominio').value.toUpperCase(),
                color: document.getElementById('vehiculoColor').value,
                anioPatentamiento: parseInt(document.getElementById('vehiculoAnio').value) || null,
                marca: { id: parseInt(document.getElementById('vehiculoMarca').value) },
                modelo: { id: parseInt(document.getElementById('vehiculoModelo').value) }
            });
            vehiculoId = vehiculo.id;
        }

        const infracciones = [];
        for (let i = 1; i <= infraccionCount; i++) {
            const el = document.getElementById(`infraccion-${i}`);
            if (!el) continue;
            infracciones.push({
                descripcion: document.getElementById(`infDesc-${i}`).value,
                importe: parseFloat(document.getElementById(`infImporte-${i}`).value),
                tiposInfraccion: [{ id: parseInt(document.getElementById(`infTipo-${i}`).value) }]
            });
        }

        const acta = {
            fechaLabrado: document.getElementById('actaFecha').value,
            horaLabrado: document.getElementById('actaHora').value + ':00',
            lugarConstatacion: document.getElementById('toggleRuta').checked
                ? document.getElementById('actaLugar').value
                : document.getElementById('actaRutaLibre').value,
            observaciones: document.getElementById('actaObservaciones').value,
            fechaVtoPagoVolun: document.getElementById('actaFechaVtoPago').value || null,
            autoridad: { id: parseInt(document.getElementById('autoridadId').value) },
            vehiculo: { id: parseInt(vehiculoId) },
            licencia: { id: parseInt(licenciaId) },
            ruta: document.getElementById('toggleRuta').checked
                ? { id: parseInt(document.getElementById('actaRuta').value) }
                : null,
            organizacionEstatal: { id: parseInt(document.getElementById('organizacionId').value) },
            infracciones: infracciones
        };

        await api.post('/actas', acta);
        showAlert('alertContainer', 'Acta guardada correctamente. Redirigiendo...', 'success');
        setTimeout(() => window.location.href = '/pages/actas.html', 2000);

    } catch (e) {
        showAlert('alertContainer', 'Error al guardar el acta. Verifique que todos los campos obligatorios estén completos.', 'error');
        console.error(e);
    }
}

// RUTA OPCIONAL
function toggleRutaSwitch() {
    const checked = document.getElementById('toggleRuta').checked;
    document.getElementById('rutaSelector').style.display = checked ? 'block' : 'none';
    document.getElementById('rutaLibre').style.display = checked ? 'none' : 'block';
}

let modalNuevaRuta;

function abrirModalNuevaRuta() {
    if (!modalNuevaRuta) modalNuevaRuta = new bootstrap.Modal(document.getElementById('modalNuevaRuta'));
    document.getElementById('nuevaRutaNombre').value = '';
    document.getElementById('nuevaRutaKm').value = '';
    document.getElementById('nuevaRutaTipo').value = '';
    modalNuevaRuta.show();
}

async function guardarNuevaRuta() {
    const nombre = document.getElementById('nuevaRutaNombre').value.trim();
    const km = document.getElementById('nuevaRutaKm').value.trim();
    const tipoId = document.getElementById('nuevaRutaTipo').value;
    if (!nombre || !tipoId) {
        showAlert('alertContainer', 'Complete el nombre y tipo de ruta.', 'error');
        return;
    }
    try {
        const ruta = await api.post('/rutas', {
            nombre,
            kilometro: km,
            tipoRuta: { id: parseInt(tipoId) }
        });
        const sel = document.getElementById('actaRuta');
        sel.innerHTML += `<option value="${ruta.id}">${ruta.nombre} - ${ruta.kilometro || ''}</option>`;
        sel.value = ruta.id;
        modalNuevaRuta.hide();
        showAlert('alertContainer', `Ruta "${ruta.nombre}" agregada correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar la ruta.', 'error');
    }
}

// MARCA Y MODELO DESDE NUEVA ACTA
let modalNuevaMarca, modalNuevoModelo;

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
        const sel = document.getElementById('vehiculoMarca');
        sel.innerHTML += `<option value="${marca.id}">${marca.nombre}</option>`;
        sel.value = marca.id;
        modalNuevaMarca.hide();
        showAlert('alertContainer', `Marca "${marca.nombre}" agregada correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar la marca.', 'error');
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
        const sel = document.getElementById('vehiculoModelo');
        sel.innerHTML += `<option value="${modelo.id}">${modelo.nombre}</option>`;
        sel.value = modelo.id;
        modalNuevoModelo.hide();
        showAlert('alertContainer', `Modelo "${modelo.nombre}" agregado correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar el modelo.', 'error');
    }
}

// TIPO DE INFRACCIÓN DESDE NUEVA ACTA
let modalNuevoTipo;
let infraccionIdActual = null;

function abrirModalNuevoTipo(infId) {
    infraccionIdActual = infId;
    if (!modalNuevoTipo) modalNuevoTipo = new bootstrap.Modal(document.getElementById('modalNuevoTipo'));
    document.getElementById('nuevoTipoCodigo').value = '';
    document.getElementById('nuevoTipoDesc').value = '';
    modalNuevoTipo.show();
}

async function guardarNuevoTipo() {
    const codigo = document.getElementById('nuevoTipoCodigo').value.trim();
    const descripcion = document.getElementById('nuevoTipoDesc').value.trim();
    if (!codigo || !descripcion) {
        showAlert('alertContainer', 'Complete el código y la descripción.', 'error');
        return;
    }
    try {
        const tipo = await api.post('/tipos-infraccion', { codigo, descripcion });

        tiposInfraccion.push(tipo);

        const sel = document.getElementById(`infTipo-${infraccionIdActual}`);
        sel.innerHTML += `<option value="${tipo.id}">${tipo.codigo} — ${tipo.descripcion}</option>`;
        sel.value = tipo.id;

        for (let i = 1; i <= infraccionCount; i++) {
            const otroSel = document.getElementById(`infTipo-${i}`);
            if (otroSel && i !== infraccionIdActual) {
                otroSel.innerHTML += `<option value="${tipo.id}">${tipo.codigo} — ${tipo.descripcion}</option>`;
            }
        }

        modalNuevoTipo.hide();
        showAlert('alertContainer', `Tipo "${tipo.codigo}" agregado correctamente.`, 'success');
    } catch {
        showAlert('alertContainer', 'Error al guardar el tipo de infracción. El código puede estar repetido.', 'error');
    }
}
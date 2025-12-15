// huespedes.js - Versión SPA con API endpoints
console.log('🏨 huespedes.js - Inicializando módulo SPA');

// Variables de estado
let huespedesConfigurado = false;
let currentPage = 0;
const pageSize = 10;

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====

function inicializarHuespedes() {
    if (huespedesConfigurado) {
        console.log('ℹ️ Módulo de huespedes ya configurado');
        return;
    }

    console.log('⚙️ Inicializando módulo de huespedes SPA...');

    // Configurar event listeners
    configurarEventListeners();

    // Configurar formularios AJAX
    configurarFormulariosAJAX();

    huespedesConfigurado = true;
    console.log('✅ Módulo de huespedes inicializado');
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====

function configurarEventListeners() {
    console.log('🔧 Configurando event listeners...');

    // Botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`📝 Editando huesped ID: ${id}`);
            cargarHuespedParaEditar(id);
        });
    });

    // Botones de ver
    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`👁️ Viendo detalles huesped ID: ${id}`);
            cargarDetallesHuesped(id);
        });
    });

    // Botones de paginación (si existen)
    document.querySelectorAll('.pagination a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick') || '';
            const match = onclick.match(/cargarComponenteConPagina\('huespedes', (\d+)\)/);
            if (match) {
                const pagina = parseInt(match[1]);
                console.log(`📄 Navegando a página: ${pagina}`);
                if (typeof cargarComponenteConPagina === 'function') {
                    cargarComponenteConPagina('huespedes', pagina);
                }
            }
        });
    });

    console.log('✅ Event listeners configurados');
}

function configurarFormulariosAJAX() {
    console.log('📝 Configurando formularios AJAX...');

    // Formulario de creación
    const formCrear = document.getElementById('formCrear');
    if (formCrear) {
        formCrear.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Enviando formulario de creación...');
            await crearHuespedAJAX(this);
        });
    }

    // Formulario de edición
    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Enviando formulario de edición...');
            await actualizarHuespedAJAX(this);
        });
    }

    console.log('✅ Formularios AJAX configurados');
}

// ===== FUNCIONES PARA CRUD CON API =====

async function crearHuespedAJAX(form) {
    console.log('🆕 Iniciando creación de huesped...');

    const btnCrear = document.getElementById('btnCrear');
    const btnTexto = document.getElementById('btnCrearTexto') || btnCrear?.querySelector('span');
    const btnSpinner = document.getElementById('btnCrearSpinner');
    const mensajeDiv = document.getElementById('mensajeCrear');

    // Validación básica
    const nombre = form.querySelector('[name="nombres"]');
    const apellido = form.querySelector('[name="apellidos"]');
    const idTipoDocumento = form.querySelector('[name="idTipoDocumento"]');
    const documento = form.querySelector('[name="documento"]');
    const email = form.querySelector('[name="email"]');
    const telefono = form.querySelector('[name="telefono"]');
    const direccion = form.querySelector('[name="direccion"]');
    const idEstado = form.querySelector('[name="idEstado"]');

    if (!nombre.value.trim()) {
        mostrarMensajeModal('❌ El nombre de huesped es requerido', 'danger', mensajeDiv);
        return;
    }

    if (!apellido.value.trim()) {
            mostrarMensajeModal('❌ El apellido de huesped es requerido', 'danger', mensajeDiv);
            return;
        }

    if (!idTipoDocumento.value) {
        mostrarMensajeModal('❌ El tipo de documento del huesped es requerido', 'danger', mensajeDiv);
        return;
    }

    if (!documento.value.trim()) {
                mostrarMensajeModal('❌ El documento del huesped es requerido', 'danger', mensajeDiv);
                return;
            }

    // Deshabilitar botón y mostrar spinner
    if (btnTexto) btnTexto.textContent = 'Guardando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnCrear) btnCrear.disabled = true;

    try {
        // Preparar datos
        const datos = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            idTipoDocumento: parseInt(idTipoDocumento.value),
            documento: documento.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            direccion: direccion.value.trim(),
            idEstadoHuesped: parseInt(idEstado.value)
        };

        console.log('📤 Enviando datos:', datos);

        // Enviar a la API
        const response = await fetch('/vistas/api/huespedes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        console.log('📥 Respuesta creación:', resultado);

        if (resultado.success) {
            mostrarMensajeModal('✅ ' + resultado.message, 'success', mensajeDiv);

            // Cerrar modal después de éxito
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrear'));
                if (modal) {
                    modal.hide();
                }

                // Resetear formulario
                form.reset();

                // Recargar el componente después de cerrar el modal
                setTimeout(() => {
                    console.log('🔄 Recargando componente...');
                    if (typeof recargarComponenteActual === 'function') {
                        recargarComponenteActual();
                    } else if (typeof cargarComponente === 'function') {
                        cargarComponente('huespedes');
                    }
                }, 500);

            }, 1500);

        } else {
            mostrarMensajeModal('❌ ' + resultado.message, 'danger', mensajeDiv);
        }

    } catch (error) {
        console.error('❌ Error en creación:', error);
        mostrarMensajeModal('❌ Error de conexión: ' + error.message, 'danger', mensajeDiv);

    } finally {
        // Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Guardar';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnCrear) btnCrear.disabled = false;
    }
}

async function actualizarHuespedAJAX(form) {
    console.log('🔄 Iniciando actualización de huesped...');

    const idInput = form.querySelector('[name="id"]');
    const id = idInput ? idInput.value : null;

    if (!id) {
        alert('❌ No se pudo obtener el ID del huesped');
        return;
    }

    const btnActualizar = document.getElementById('btnActualizar');
    const btnTexto = document.getElementById('btnActualizarTexto') || btnActualizar?.querySelector('span');
    const btnSpinner = document.getElementById('btnActualizarSpinner');
    const mensajeDiv = document.getElementById('mensajeEditar');

    // Deshabilitar botón
    if (btnTexto) btnTexto.textContent = 'Actualizando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnActualizar) btnActualizar.disabled = true;

    try {
        const formData = new FormData(form);
        const datos = {};

        // 🔹 Cargar datos dinámicamente (FOREACH)
        formData.forEach((value, key) => {
            if (!value || key === 'id') return;

            if (key === 'idTipoDocumento' || key === 'idEstado') {
                datos[key === 'idEstado' ? 'idEstadoHuesped' : key] = parseInt(value);
            } else {
                datos[key] = value.trim();
            }
        });

        console.log('📤 Enviando datos para actualizar:', datos);

        const response = await fetch(`/vistas/api/huespedes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        console.log('📥 Respuesta actualización:', resultado);

        if (resultado.success) {
            mostrarMensajeModal('✅ ' + resultado.message, 'success', mensajeDiv);

            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
                if (modal) modal.hide();

                setTimeout(() => {
                    if (typeof recargarComponenteActual === 'function') {
                        recargarComponenteActual();
                    } else {
                        cargarComponente('huespedes');
                    }
                }, 500);
            }, 1200);

        } else {
            mostrarMensajeModal('❌ ' + resultado.message, 'danger', mensajeDiv);
        }

    } catch (error) {
        console.error('❌ Error en actualización:', error);
        mostrarMensajeModal('❌ Error de conexión: ' + error.message, 'danger', mensajeDiv);

    } finally {
        if (btnTexto) btnTexto.textContent = 'Actualizar';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnActualizar) btnActualizar.disabled = false;
    }
}

async function cargarHuespedParaEditar(id) {
    console.log(`🔍 Cargando habitación ${id} para editar...`);

    // Mostrar loading en el modal
    const contenidoEditar = document.getElementById('contenidoEditar');
    if (contenidoEditar) {
        contenidoEditar.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando datos...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`/vistas/api/huespedes/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const resultado = await response.json();

        if (resultado.success) {
            const huesped = resultado.data;
            console.log('✅ Huesped cargada:', huesped);

            // Crear formulario de edición
            const formulario = `
                <div class="row g-6">
                    <input type="hidden" name="id" value="${huesped.id}">

                    <div class="col-md-6">
                        <label class="form-label">Nombres *</label>
                        <input type="text" class="form-control" name="nombre"
                               value="${huesped.nombre || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Apellidos *</label>
                        <input type="text" class="form-control" name="apellido"
                               value="${huesped.apellido || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Tipo de documento *</label>
                        <select class="form-select" name="idTipoDocumento" required>
                            <option value="">Seleccione un tipo</option>
                            <option value="1" ${huesped.idTipoDocumento == 1 ? 'selected' : ''}>Cedula</option>
                            <option value="2" ${huesped.idTipoDocumento == 2 ? 'selected' : ''}>Pasaporte</option>
                            <option value="3" ${huesped.idTipoDocumento == 3 ? 'selected' : ''}>DNI</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Documento *</label>
                        <input type="text" class="form-control" name="documento"
                               value="${huesped.documento || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" name="email"
                               value="${huesped.email || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Telefono *</label>
                        <input type="text" class="form-control" name="telefono"
                               value="${huesped.telefono || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Direccion *</label>
                        <input type="text" class="form-control" name="direccion"
                               value="${huesped.direccion || ''}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Estado *</label>
                        <select class="form-select" name="idEstado" required>
                            <option value="">Seleccione un tipo</option>
                            <option value="1" ${huesped.idEstadoHuesped == 1 ? 'selected' : ''}>Activo</option>
                            <option value="2" ${huesped.idEstadoHuesped == 2 ? 'selected' : ''}>En deuda</option>
                            <option value="3" ${huesped.idEstadoHuesped == 3 ? 'selected' : ''}>En estadia</option>
                            <option value="4" ${huesped.idEstadoHuesped == 4 ? 'selected' : ''}>Salida</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">ID</label>
                        <p class="form-control-plaintext">${huesped.id}</p>
                    </div>
                </div>
            `;

            if (contenidoEditar) {
                contenidoEditar.innerHTML = formulario;
            }

            // Actualizar action del formulario (por compatibilidad)
            const formEditar = document.getElementById('formEditar');
            if (formEditar) {
                formEditar.action = `/vistas/huespedes/actualizar/${id}`;
                console.log('✅ Formulario de edición configurado para ID:', id);
            }

        } else {
            throw new Error(resultado.message);
        }

    } catch (error) {
        console.error('❌ Error cargando habitación:', error);

        if (contenidoEditar) {
            contenidoEditar.innerHTML = `
                <div class="alert alert-danger">
                    <h5>❌ Error</h5>
                    <p>No se pudo cargar la habitación.</p>
                    <p><small>${error.message}</small></p>
                    <button class="btn btn-sm btn-warning" onclick="cargarHuespedParaEditar(${id})">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

async function cargarDetallesHuesped(id) {
    console.log(`👁️ Cargando detalles habitación ${id}...`);

    try {
        const response = await fetch(`/vistas/api/huespedes/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const resultado = await response.json();

        if (resultado.success) {
            const huesped = resultado.data;

            const estado =
                huesped.idEstadoHuesped == 1
                    ? '🟢 Activo'
                    : huesped.idEstadoHuesped == 2
                        ? '🟡 En deuda'
                        : huesped.idEstadoHuesped == 3
                            ? '🔵 En estadía'
                            : huesped.idEstadoHuesped == 4
                                ? '⚫ Salida'
                                : '⚠️ Sin estado';

            const contenido = `
                <div class="row">
                    <div class="col-12 text-center mb-3">
                        <h4 class="text-primary">🏨 Huesped ${huesped.nombre} ${huesped.apellido}</h4>
                        ${estado}
                    </div>

                    <div class="col-md-12 mb-3 text center">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Información General</h6>
                                <p><strong>Documento:</strong> ${
                                    huesped.idTipoDocumento == 1 ? 'Cédula' :
                                    huesped.idTipoDocumento == 2 ? 'Pasaporte' :
                                    huesped.idTipoDocumento == 3 ? 'DNI' :
                                    'Sin tipo'
                                } ${huesped.documento}</p>
                                <p><strong>Email:</strong> ${huesped.email}</p>
                                <p><strong>Telefono:</strong> ${huesped.telefono}</p>
                                <p><strong>Direccion:</strong> ${huesped.direccion}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const contenidoVer = document.getElementById('contenidoVer');
            if (contenidoVer) {
                contenidoVer.innerHTML = contenido;
            }

        } else {
            throw new Error(resultado.message);
        }

    } catch (error) {
        console.error('❌ Error cargando detalles:', error);

        const contenidoVer = document.getElementById('contenidoVer');
        if (contenidoVer) {
            contenidoVer.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar los detalles: ${error.message}
                </div>
            `;
        }
    }
}


function mostrarMensajeModal(mensaje, tipo, contenedor) {
    if (!contenedor) return;

    const icono = tipo === 'success' ? '✅' :
                 tipo === 'danger' ? '❌' :
                 tipo === 'warning' ? '⚠️' : 'ℹ️';

    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            <span>${icono} ${mensaje}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        </div>
    `;
    contenedor.style.display = 'block';

    // Auto-ocultar después de 5 segundos (excepto warnings)
    if (tipo !== 'warning') {
        setTimeout(() => {
            if (contenedor.innerHTML.includes(mensaje)) {
                contenedor.style.display = 'none';
            }
        }, 5000);
    }
}

// ===== EXPOSICIÓN GLOBAL DE FUNCIONES =====

// Hacer funciones disponibles globalmente
window.inicializarHuespedes = inicializarHuespedes;
window.cargarHuespedParaEditar = cargarHuespedParaEditar;
window.cargarDetallesHuesped = cargarDetallesHuesped;
window.crearHuespedAJAX = crearHuespedAJAX;
window.actualizarHuespedAJAX = actualizarHuespedAJAX;
window.mostrarMensajeModal = mostrarMensajeModal;

// Inicializar cuando el script se cargue
console.log('✅ huespedes.js cargado - Módulo listo');

// Si estamos en el contexto de huespedes, inicializar automáticamente
if (document.getElementById('huespedes-container')) {
    console.log('🔍 Detectado contenedor de huespedes - Inicializando...');
    setTimeout(() => {
        if (typeof inicializarHuespedes === 'function') {
            inicializarHuespedes();
        }
    }, 300);
}

// Exportar para módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inicializarHuespedes,
        cargarHuespedParaEditar,
        cargarDetallesHuesped,
        crearHuespedAJAX,
        actualizarHuespedAJAX
    };
}
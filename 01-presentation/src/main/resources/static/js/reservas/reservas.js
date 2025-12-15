// ==========================================================
// reservas.js - Módulo SPA para Gestión de Reservas (AJAX)
// Asume que funciones globales como recargarComponenteActual y mostrarAlertaGlobal existen
// ==========================================================

console.log('🗓️ reservas.js - Inicializando módulo SPA');

let reservasConfigurado = false;

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN (Llamada desde el fragmento) =====

function inicializarReservas() {
    if (reservasConfigurado) {
        console.log('ℹ️ Módulo de reservas ya configurado');
        return;
    }

    console.log('⚙️ Inicializando módulo de reservas SPA...');

    const reservasContainer = document.getElementById('reservas-container');
    if (reservasContainer) {
        configurarDelegacionDeEventos(reservasContainer);
    }

    configurarModales(); // Configura eventos de modales al cerrar

    reservasConfigurado = true;
    console.log('✅ Módulo de reservas inicializado');
}

// ===== 1. DELEGACIÓN DE EVENTOS (Captura clics en botones de la tabla y paginación) =====

function configurarDelegacionDeEventos(container) {
    console.log('🔧 Configurando delegación de eventos...');

    container.addEventListener('click', function(e) {

        const targetButton = e.target.closest('button');
        const targetLink = e.target.closest('a');

        // 1. Botones de ACCIÓN (Editar, Ver Detalle, Eliminar)
        if (targetButton && targetButton.hasAttribute('data-id')) {
            const id = targetButton.getAttribute('data-id');

            if (targetButton.classList.contains('btn-editar-reserva')) {
                // El modal se abre automáticamente (data-bs-toggle), solo cargamos el contenido.
                cargarReservaParaEditar(id);
            } else if (targetButton.classList.contains('btn-ver-detalle-reserva')) {
                // El modal se abre automáticamente (data-bs-toggle), solo cargamos el contenido.
                cargarDetallesReserva(id);
            } else if (targetButton.classList.contains('btn-eliminar-reserva')) {
                // Configurar el ID en el input hidden del modal de eliminación
                document.getElementById('idReservaEliminar').value = id;
                document.getElementById('reserva-id-eliminar').textContent = id;
            }
        }

        // 2. Enlaces de PAGINACIÓN
        if (targetLink && targetLink.classList.contains('pagination-reservas-link')) {
            e.preventDefault();
            const pagina = targetLink.getAttribute('data-page');

            if (pagina !== null && typeof cargarComponenteConPagina === 'function') {
                console.log(`📄 Navegando a página: ${pagina}`);
                // Llama a la función global para recargar el fragmento con la nueva página
                cargarComponenteConPagina('reservas', parseInt(pagina));
            }
        }
    });

    console.log('✅ Delegación de eventos configurada');
}

// ===== 2. CONFIGURACIÓN DE MODALES (Limpieza al cerrar) =====

function configurarModales() {
    const modalEditar = document.getElementById('modalEditarReserva');
    if (modalEditar) {
        modalEditar.addEventListener('hidden.bs.modal', function () {
            // Limpiar el contenido dinámico del modal de edición
            document.getElementById('modal-body-editar').innerHTML = '<div class="text-center p-5">Cargando datos...</div>';
            document.getElementById('reserva-id-editar').textContent = '';
            // Ocultar mensajes de alerta
            document.getElementById('mensajeEditarReserva').style.display = 'none';
        });
    }

    const modalDetalle = document.getElementById('modalVerDetalleReserva');
    if (modalDetalle) {
        modalDetalle.addEventListener('hidden.bs.modal', function () {
            // Limpiar el contenido dinámico del modal de detalle
            document.getElementById('modal-body-detalle').innerHTML = '<div class="text-center p-5">Cargando datos...</div>';
            document.getElementById('reserva-id-detalle').textContent = '';
        });
    }

    const modalEliminar = document.getElementById('modalEliminarReserva');
    if (modalEliminar) {
        modalEliminar.addEventListener('hidden.bs.modal', function () {
            // Limpiar ID y mensajes de alerta
            document.getElementById('idReservaEliminar').value = '';
            document.getElementById('reserva-id-eliminar').textContent = '';
            document.getElementById('mensajeEliminarReserva').style.display = 'none';
        });
    }

    const modalCrear = document.getElementById('modalCrearReserva');
    if (modalCrear) {
        modalCrear.addEventListener('hidden.bs.modal', function () {
            // Limpiar formulario y mensajes al cerrar el modal de Creación
            const form = document.getElementById('formCrearReserva');
            if (form) form.reset();
            document.getElementById('mensajeCrearReserva').style.display = 'none';
        });
    }
}


// ===== 3. FUNCIONES CRUD: CARGA DE DATOS PARA MODALES (GET) =====

/**
 * Carga los datos de una reserva y construye el formulario de edición.
 */
async function cargarReservaParaEditar(id) {
    const contenidoEditar = document.getElementById('modal-body-editar');
    const idSpan = document.getElementById('reserva-id-editar');

    // 1. Mostrar loading
    if (contenidoEditar) contenidoEditar.innerHTML = `
        <div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando datos de reserva...</p></div>
    `;
    if (idSpan) idSpan.textContent = id; // Mostrar ID inmediatamente
    document.getElementById('mensajeEditarReserva').style.display = 'none';

    try {
        // Asumiendo el endpoint API /vistas/api/reservas/{id}
        const response = await fetch(`/vistas/api/reservas/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const resultado = await response.json();

        if (resultado.success) {
            const reserva = resultado.data;
            console.log('✅ Reserva cargada:', reserva);

            // 2. Construir formulario de edición (debes adaptarlo a tu modelo de Reserva)
            const formulario = `
                <input type="hidden" name="idReserva" value="${reserva.idReserva}">
                <div id="mensajeEditarReserva" class="alert" style="display:none;"></div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Huésped (ID: ${reserva.huesped?.idHuesped || 'N/A'})</label>
                        <input type="text" class="form-control" value="${reserva.huesped?.nombre + ' ' + reserva.huesped?.apellido || 'N/A'}" disabled>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Habitación (Núm: ${reserva.habitacion?.numeroHabitacion || 'N/A'})</label>
                        <input type="text" class="form-control" value="Tipo: ${reserva.habitacion?.tiposHabitacion?.nombreTipo || 'N/A'}" disabled>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Fecha Entrada *</label>
                        <input type="date" class="form-control" name="fechaEntrada"
                                value="${reserva.fechaEntrada || ''}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Fecha Salida *</label>
                        <input type="date" class="form-control" name="fechaSalida"
                                value="${reserva.fechaSalida || ''}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Total Estimado *</label>
                        <input type="number" step="0.01" class="form-control" name="totalEstimado"
                                value="${reserva.totalEstimado || 0}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Estado de Reserva *</label>
                        <select class="form-select" name="idEstadoReserva" required>
                            <option value="">Seleccionar Estado</option>
                            <option value="1" ${reserva.estadoReserva?.idEstadoReserva == 1 ? 'selected' : ''}>Pendiente</option>
                            <option value="2" ${reserva.estadoReserva?.idEstadoReserva == 2 ? 'selected' : ''}>Confirmada</option>
                            <option value="3" ${reserva.estadoReserva?.idEstadoReserva == 3 ? 'selected' : ''}>Check-In</option>
                            <option value="4" ${reserva.estadoReserva?.idEstadoReserva == 4 ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>
                </div>
            `;
            if (contenidoEditar) contenidoEditar.innerHTML = formulario;

        } else {
            throw new Error(resultado.message || 'Error al obtener datos');
        }

    } catch (error) {
        console.error('❌ Error cargando reserva:', error);
        if (contenidoEditar) contenidoEditar.innerHTML = `
            <div class="alert alert-danger p-3">
                <h5>❌ Error de Carga</h5>
                <p>No se pudo cargar la reserva: ${error.message}</p>
                <button class="btn btn-sm btn-warning" onclick="cargarReservaParaEditar('${id}')">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Carga los detalles de una reserva para el modal de visualización.
 */
async function cargarDetallesReserva(idReserva) {
    const contenidoDetalle = document.getElementById('modal-body-detalle');
    const idSpan = document.getElementById('reserva-id-detalle');

    // 1. Mostrar loading
    if (contenidoDetalle) contenidoDetalle.innerHTML = `
        <div class="text-center py-4"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando detalles...</p></div>
    `;
    if (idSpan) idSpan.textContent = id; // Mostrar ID inmediatamente

    try {
        const response = await fetch(`/vistas/api/reservas/${idReserva}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const resultado = await response.json();

        if (resultado.success) {
            const r = resultado.data; // Reserva
            console.log('✅ Detalles cargados:', r);

            // 2. Construir la vista de detalles
            const detalles = `
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>ID Reserva:</strong>
                        <span>#${r.idReserva}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Huésped:</strong>
                        <span>${r.huesped?.nombre + ' ' + r.huesped?.apellido || 'N/A'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Habitación:</strong>
                        <span>${r.habitacion?.numeroHabitacion || 'N/A'} (${r.habitacion?.tiposHabitacion?.nombreTipo || ''})</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Entrada / Salida:</strong>
                        <span>${r.fechaEntrada} / ${r.fechaSalida}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Noches:</strong>
                        <span>${r.noches || 'N/A'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Total Estimado:</strong>
                        <span class="text-success">$${parseFloat(r.totalEstimado).toLocaleString('es-CO')}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Estado:</strong>
                        <span class="badge bg-primary">${r.estadoReserva?.descripcion || 'N/A'}</span>
                    </li>
                </ul>
            `;
            if (contenidoDetalle) contenidoDetalle.innerHTML = detalles;

        } else {
            throw new Error(resultado.message || 'Error al obtener detalles');
        }

    } catch (error) {
        console.error('❌ Error cargando detalles:', error);
        if (contenidoDetalle) contenidoDetalle.innerHTML = `
            <div class="alert alert-danger p-3">
                <h5>❌ Error de Carga</h5>
                <p>No se pudo cargar los detalles: ${error.message}</p>
                <button class="btn btn-sm btn-warning" onclick="cargarDetallesReserva('${id}')">Reintentar</button>
            </div>
        `;
    }
}


// ===== 4. FUNCIONES CRUD: ENVÍO DE FORMULARIOS (AJAX) =====

/**
 * Función para actualizar una reserva vía AJAX (PUT).
 */
async function actualizarReservaAJAX(form) {
    console.log('🔄 Iniciando actualización de reserva...');

    const idInput = form.querySelector('[name="idReserva"]');
    const id = idInput ? idInput.value : null;

    if (!id) {
        mostrarMensajeModal('❌ No se pudo obtener el ID de la reserva.', 'danger', document.getElementById('mensajeEditarReserva'));
        return;
    }

    const btn = document.getElementById('btnGuardarEdicionReserva');
    const btnTexto = document.getElementById('btnGuardarEdicionTexto');
    const btnSpinner = document.getElementById('btnGuardarEdicionSpinner');
    const mensajeDiv = document.getElementById('mensajeEditarReserva');

    // 1. Deshabilitar botón
    if (btnTexto) btnTexto.textContent = 'Actualizando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btn) btn.disabled = true;

    try {
        const formData = new FormData(form);
        const datos = {};

        // 2. Construir objeto de datos (solo campos editables)
        formData.forEach((value, key) => {
             // Solo incluimos los campos que realmente se editan
            if (key !== 'idReserva') {
                if (key === 'idEstadoReserva') {
                    datos[key] = parseInt(value);
                } else if (key === 'totalEstimado') {
                    datos[key] = parseFloat(value);
                } else {
                    datos[key] = value.trim();
                }
            }
        });

        console.log('📤 Enviando datos para actualizar:', datos);

        // 3. Enviar a la API (PUT)
        const response = await fetch(`/vistas/api/reservas/${id}`, {
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

            // 4. Cerrar modal y recargar vista
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva'));
                if (modal) modal.hide();

                setTimeout(() => {
                    // Recargar el fragmento principal para actualizar la tabla
                    if (typeof recargarComponenteActual === 'function') {
                        recargarComponenteActual();
                    } else if (typeof cargarComponente === 'function') {
                        cargarComponente('reservas');
                    }
                }, 500);
            }, 1200);

        } else {
            mostrarMensajeModal('❌ ' + (resultado.message || 'Error desconocido al actualizar'), 'danger', mensajeDiv);
        }

    } catch (error) {
        console.error('❌ Error en actualización:', error);
        mostrarMensajeModal('❌ Error de conexión: ' + error.message, 'danger', mensajeDiv);

    } finally {
        // 5. Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Guardar Cambios';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btn) btn.disabled = false;
    }
}

/**
 * Función para eliminar una reserva vía AJAX (DELETE).
 */
async function eliminarReservaAJAX(form) {
    const id = form.querySelector('[name="idReservaEliminar"]').value;
    console.log(`🗑️ Iniciando eliminación de reserva ID: ${id}`);

    if (!id) return;

    const btn = document.getElementById('btnConfirmarEliminacion');
    const btnTexto = document.getElementById('btnConfirmarTexto');
    const btnSpinner = document.getElementById('btnConfirmarSpinner');
    const mensajeDiv = document.getElementById('mensajeEliminarReserva');

    // 1. Deshabilitar botón
    if (btnTexto) btnTexto.textContent = 'Eliminando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btn) btn.disabled = true;

    try {
        // 2. Enviar a la API (DELETE)
        const response = await fetch(`/vistas/api/reservas/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        const resultado = await response.json();
        console.log('📥 Respuesta eliminación:', resultado);

        if (resultado.success) {
            mostrarMensajeModal('✅ ' + resultado.message, 'success', mensajeDiv);

            // 3. Cerrar modal y recargar vista
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminarReserva'));
                if (modal) modal.hide();

                // Usar función global para mostrar la alerta en el contenedor principal
                if (typeof mostrarAlertaGlobal === 'function') {
                    mostrarAlertaGlobal('Reserva eliminada con éxito.', 'success', 3000);
                }

                setTimeout(() => {
                    if (typeof recargarComponenteActual === 'function') {
                        recargarComponenteActual();
                    } else if (typeof cargarComponente === 'function') {
                        cargarComponente('reservas');
                    }
                }, 500);
            }, 1200);

        } else {
            mostrarMensajeModal('❌ ' + (resultado.message || 'Error desconocido al eliminar'), 'danger', mensajeDiv);
        }

    } catch (error) {
        console.error('❌ Error en eliminación:', error);
        mostrarMensajeModal('❌ Error de conexión: ' + error.message, 'danger', mensajeDiv);

    } finally {
        // 4. Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Eliminar';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btn) btn.disabled = false;
    }
}


/**
 * Función para crear una nueva reserva vía AJAX (POST).
 * **NOTA:** Esta función debe ser definida como una nueva función, no dentro del finally de la anterior.
 */
async function crearReservaAJAX(form) {
    console.log('🚀 Iniciando creación de nueva reserva...');

    const btn = document.getElementById('btnGuardarNuevaReserva');
    const btnTexto = document.getElementById('btnCrearTexto');
    const btnSpinner = document.getElementById('btnCrearSpinner');
    const mensajeDiv = document.getElementById('mensajeCrearReserva');

    // 1. Deshabilitar botón
    if (btnTexto) btnTexto.textContent = 'Guardando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btn) btn.disabled = true;

    try {
        const formData = new FormData(form);
        const datos = {};

        // 2. Construir objeto de datos
        formData.forEach((value, key) => {
            if (key === 'idHuesped' || key === 'idHabitacion' || key === 'idEstadoReserva') {
                // Envía solo el ID del objeto relacionado. Tu API Controller debe manejar esto.
                datos[key] = parseInt(value);
            } else if (key === 'totalEstimado') {
                datos[key] = parseFloat(value);
            } else {
                datos[key] = value.trim();
            }
        });

        // Ejemplo de estructura de datos ajustada para un DTO (puede variar según tu backend):
        const datosFinales = {
            fechaEntrada: datos.fechaEntrada,
            fechaSalida: datos.fechaSalida,
            totalEstimado: datos.totalEstimado,
            // Aquí puedes necesitar un objeto completo en lugar de solo el ID, ej:
            // estadoReserva: { idEstadoReserva: datos.idEstadoReserva }
            // huesped: { idHuesped: datos.idHuesped }
            // habitacion: { idHabitacion: datos.idHabitacion }
            idEstadoReserva: datos.idEstadoReserva,
            idHuesped: datos.idHuesped,
            idHabitacion: datos.idHabitacion
        };

        console.log('📤 Enviando datos de creación:', datosFinales);

        // 3. Enviar a la API (POST)
        const response = await fetch(`/vistas/api/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosFinales)
        });

        const resultado = await response.json();
        console.log('📥 Respuesta creación:', resultado);

        if (resultado.success) {
            mostrarMensajeModal('✅ ' + resultado.message, 'success', mensajeDiv);

            // 4. Cerrar modal y recargar vista
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearReserva'));
                if (modal) modal.hide();

                // Recargar el fragmento principal para actualizar la tabla
                setTimeout(() => {
                    if (typeof recargarComponenteActual === 'function') {
                        // Recarga al inicio de la lista para ver el nuevo registro
                        recargarComponenteActual();
                    }
                }, 500);

                // Limpiar formulario después de guardar (se hace en configurarModales al cerrar)
                // form.reset(); 

            }, 1200);

        } else {
            mostrarMensajeModal('❌ ' + (resultado.message || 'Error desconocido al crear'), 'danger', mensajeDiv);
        }

    } catch (error) {
        console.error('❌ Error en la creación:', error);
        mostrarMensajeModal('❌ Error de conexión: ' + error.message, 'danger', mensajeDiv);

    } finally {
        // 5. Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Guardar Reserva';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btn) btn.disabled = false;
    }
}


// // ----------------------------------------------------------------------------------
// // ** NOTAS IMPORTANTES **
// // ----------------------------------------------------------------------------------
// // 1. Las funciones 'mostrarMensajeModal' y 'mostrarAlertaGlobal' deben estar definidas
// //    en un archivo JS de utilidades global (ej. 'main.js') para funcionar.
// // 2. La función 'cargarComponenteConPagina' o 'recargarComponenteActual' debe ser una función global
// //    que maneje la inyección de fragmentos de Thymeleaf vía AJAX.
// // ----------------------------------------------------------------------------------
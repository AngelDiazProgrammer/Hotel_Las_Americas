console.log('🗓️ reservas.js cargado');

function inicializarReservas() {
    console.log('⚙️ Inicializando módulo Reservas');

    const container = document.getElementById('reservas-container');
    if (!container) {
        console.error('❌ No existe #reservas-container');
        return;
    }

    configurarDelegacionDeEventos(container);
    configurarModales();
}

function configurarDelegacionDeEventos(container) {
    console.log('🧲 Delegación de eventos registrada');

    container.onclick = async (e) => {
        console.log('🖱️ Click detectado:', e.target);

        const btn = e.target.closest('button');
        if (!btn || !btn.dataset.id) return;

        const id = btn.dataset.id;

        if (btn.classList.contains('btn-editar-reserva')) {
            console.log('🔥 EDITAR DISPARADO, ID:', id);
            await cargarReservaParaEditar(id);
        }

        if (btn.classList.contains('btn-ver-detalle-reserva')) {
            await cargarDetallesReserva(id);
        }

        if (btn.classList.contains('btn-eliminar-reserva')) {
            document.getElementById('idReservaEliminar').value = id;
            document.getElementById('reserva-id-eliminar').textContent = id;
        }
    };
}

function configurarModales() {
    document.getElementById('modalEditarReserva')
        ?.addEventListener('hidden.bs.modal', () => {
            document.getElementById('modal-body-editar').innerHTML = '';
        });
}

async function crearReservaAJAX(form) {
    console.log('🆕 Iniciando creación de reserva...');

    // Elementos de la UI
    const btnCrear = document.getElementById('btnCrearReserva'); // Asume que el ID del botón es 'btnCrearReserva'
    const btnTexto = btnCrear?.querySelector('span#btnCrearReservaTexto');
    const btnSpinner = btnCrear?.querySelector('span#btnCrearReservaSpinner');
    const mensajeDiv = document.getElementById('mensajeCrearReserva'); // Asume que el ID del contenedor de mensajes es 'mensajeCrearReserva'

    // Campos de datos (Asegúrate de que los nombres de los campos en el formulario coincidan)
    const fechaEntrada = form.querySelector('[name="fechaEntrada"]');
    const fechaSalida = form.querySelector('[name="fechaSalida"]');
    const totalEstimado = form.querySelector('[name="totalEstimado"]');
    const idEstadoReserva = form.querySelector('[name="idEstadoReserva"]');
    const idHuesped = form.querySelector('[name="idHuesped"]'); // Asume que se enlaza a un huésped existente

    // 1. Validación de Datos
    if (!fechaEntrada.value) {
        mostrarMensajeModal('❌ La fecha de entrada es requerida', 'danger', mensajeDiv);
        return;
    }
    if (!fechaSalida.value) {
        mostrarMensajeModal('❌ La fecha de salida es requerida', 'danger', mensajeDiv);
        return;
    }
    if (new Date(fechaEntrada.value) >= new Date(fechaSalida.value)) {
        mostrarMensajeModal('❌ La fecha de salida debe ser posterior a la fecha de entrada.', 'danger', mensajeDiv);
        return;
    }
    if (!totalEstimado.value || parseFloat(totalEstimado.value) <= 0) {
        mostrarMensajeModal('❌ El total estimado debe ser un valor positivo.', 'danger', mensajeDiv);
        return;
    }
    if (!idHuesped.value || parseInt(idHuesped.value) <= 0) {
        mostrarMensajeModal('❌ Debe seleccionar un huésped para la reserva.', 'danger', mensajeDiv);
        return;
    }
    if (!idEstadoReserva.value) {
        mostrarMensajeModal('❌ El estado inicial de la reserva es requerido.', 'danger', mensajeDiv);
        return;
    }

    // 2. Deshabilitar botón y mostrar spinner
    if (btnTexto) btnTexto.textContent = 'Guardando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnCrear) btnCrear.disabled = true;
    mensajeDiv.style.display = 'none'; // Ocultar mensajes previos

    try {
        // 3. Preparar datos
        const datos = {
            fechaEntrada: fechaEntrada.value,
            fechaSalida: fechaSalida.value,
            totalEstimado: parseFloat(totalEstimado.value), // Convertir a número flotante
            idEstadoReserva: parseInt(idEstadoReserva.value), // Convertir a entero
            idHuesped: parseInt(idHuesped.value) // Convertir a entero
            // Puedes añadir más campos según tu modelo (ej: idHabitacion, comentarios, etc.)
        };

        console.log('📤 Enviando datos de reserva:', datos);

        // 4. Enviar a la API
        const response = await fetch('/vistas/api/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        console.log('📥 Respuesta creación de reserva:', resultado);

        // 5. Manejar Respuesta
        if (resultado.success) {
            mostrarMensajeModal('✅ ' + resultado.message, 'success', mensajeDiv);

            // Cerrar modal después de éxito y recargar
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearReserva')); // Asume ID 'modalCrearReserva'
                if (modal) {
                    modal.hide();
                }

                // Resetear formulario
                form.reset();

                // Recargar el componente (reservas en este caso)
                setTimeout(() => {
                    console.log('🔄 Recargando componente de reservas...');
                    if (typeof recargarComponenteActual === 'function') {
                        recargarComponenteActual();
                    } else if (typeof cargarComponente === 'function') {
                        cargarComponente('reservas');
                    }
                }, 500);

            }, 1500);

        } else {
            // Error retornado por la API
            mostrarMensajeModal('❌ ' + resultado.message, 'danger', mensajeDiv);
        }

    } catch (error) {
        // Error de red o código
        console.error('❌ Error en creación de reserva:', error);
        mostrarMensajeModal('❌ Error de conexión al servidor: ' + error.message, 'danger', mensajeDiv);

    } finally {
        // 6. Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Guardar';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnCrear) btnCrear.disabled = false;
    }
}

async function cargarReservaParaEditar(id) {
    const body = document.getElementById('modal-body-editar');
    document.getElementById('reserva-id-editar').textContent = id;

    body.innerHTML = spinner('Cargando reserva...');

    try {
        const res = await fetch(`/api/reservas/${id}`);
        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        const r = json.data;

        body.innerHTML = `
            <form id="formEditarReserva" onsubmit="event.preventDefault(); actualizarReservaAJAX(this)">
                <input type="hidden" name="idReserva" value="${r.idReserva}">
                <div id="mensajeEditarReserva" class="alert" style="display:none"></div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Fecha Entrada</label>
                        <input type="date" name="fechaEntrada" class="form-control" value="${r.fechaEntrada}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Fecha Salida</label>
                        <input type="date" name="fechaSalida" class="form-control" value="${r.fechaSalida}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Total Estimado</label>
                        <input type="number" step="0.01" name="totalEstimado" class="form-control" value="${r.totalEstimado}" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Estado</label>
                        <select name="idEstadoReserva" class="form-select" required>
                            <option value="1" ${r.estadoReserva?.idEstadoReserva == 1 ? 'selected' : ''}>Pendiente</option>
                            <option value="2" ${r.estadoReserva?.idEstadoReserva == 2 ? 'selected' : ''}>Confirmada</option>
                            <option value="3" ${r.estadoReserva?.idEstadoReserva == 3 ? 'selected' : ''}>Check-In</option>
                            <option value="4" ${r.estadoReserva?.idEstadoReserva == 4 ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>
                </div>

                <div class="mt-3 text-end">
                    <button class="btn btn-primary">Guardar cambios</button>
                </div>
            </form>
        `;
    } catch (err) {
        body.innerHTML = errorBox(err.message);
    }
}

async function cargarDetallesReserva(id) {
    const body = document.getElementById('modal-body-detalle');
    body.innerHTML = spinner('Cargando detalles...');

    try {
        const res = await fetch(`/api/reservas/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const r = json.data;

        body.innerHTML = `
            <ul class="list-group">
                <li class="list-group-item"><b>ID:</b> ${r.idReserva}</li>
                <li class="list-group-item"><b>Entrada:</b> ${r.fechaEntrada}</li>
                <li class="list-group-item"><b>Salida:</b> ${r.fechaSalida}</li>
                <li class="list-group-item"><b>Total:</b> $${r.totalEstimado}</li>
            </ul>
        `;
    } catch (err) {
        body.innerHTML = errorBox(err.message);
    }
}

async function actualizarReservaAJAX(form) {
    const id = form.idReserva.value;
    const msg = document.getElementById('mensajeEditarReserva');

    try {
        const data = Object.fromEntries(new FormData(form));
        delete data.idReserva;

        data.idEstadoReserva = parseInt(data.idEstadoReserva);
        data.totalEstimado = parseFloat(data.totalEstimado);

        const res = await fetch(`/api/reservas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        mostrarMensajeModal('Reserva actualizada', 'success', msg);

        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva')).hide();
            recargarComponenteActual();
        }, 800);

    } catch (err) {
        mostrarMensajeModal(err.message, 'danger', msg);
    }
}

function spinner(text) {
    return `<div class="text-center py-4"><div class="spinner-border"></div><p>${text}</p></div>`;
}

function errorBox(msg) {
    return `<div class="alert alert-danger">${msg}</div>`;
}

window.renderReservas = function (data) {
    console.log('🗓️ Renderizando reservas', data);

    const container = document.getElementById('reservas-container');
    if (!container) return;

    const reservas = data.reservas || [];

    let html = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    reservas.forEach((r, i) => {
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${r.fechaEntrada}</td>
                <td>${r.fechaSalida}</td>
                <td>$${r.totalEstimado}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar-reserva"
                        data-id="${r.idReserva}"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEditarReserva">
                        Editar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    inicializarReservas();
};

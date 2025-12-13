// habitaciones.js - Versión SPA con API endpoints
console.log('🏨 habitaciones.js - Inicializando módulo SPA');

// Variables de estado
let habitacionesConfigurado = false;
let currentPage = 0;
const pageSize = 10;

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====

function inicializarHabitaciones() {
    if (habitacionesConfigurado) {
        console.log('ℹ️ Módulo de habitaciones ya configurado');
        return;
    }
    
    console.log('⚙️ Inicializando módulo de habitaciones SPA...');
    
    // Cargar estadísticas
    cargarEstadisticas();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Configurar formularios AJAX
    configurarFormulariosAJAX();
    
    habitacionesConfigurado = true;
    console.log('✅ Módulo de habitaciones inicializado');
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====

function configurarEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`📝 Editando habitación ID: ${id}`);
            cargarHabitacionParaEditar(id);
        });
    });
    
    // Botones de ver
    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`👁️ Viendo detalles habitación ID: ${id}`);
            cargarDetallesHabitacion(id);
        });
    });
    
    // Botones de inhabilitar
    document.querySelectorAll('.btn-inhabilitar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`🚫 Solicitando inhabilitar ID: ${id}`);
            confirmarCambioEstado(id, 'inhabilitar');
        });
    });
    
    // Botones de habilitar
    document.querySelectorAll('.btn-habilitar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log(`✅ Solicitando habilitar ID: ${id}`);
            confirmarCambioEstado(id, 'habilitar');
        });
    });
    
    // Botones de paginación (si existen)
    document.querySelectorAll('.pagination a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick') || '';
            const match = onclick.match(/cargarComponenteConPagina\('habitaciones', (\d+)\)/);
            if (match) {
                const pagina = parseInt(match[1]);
                console.log(`📄 Navegando a página: ${pagina}`);
                if (typeof cargarComponenteConPagina === 'function') {
                    cargarComponenteConPagina('habitaciones', pagina);
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
            await crearHabitacionAJAX(this);
        });
        
        // Validación en tiempo real para número de habitación
        const inputNumero = formCrear.querySelector('[name="numeroHabitacion"]');
        if (inputNumero) {
            inputNumero.addEventListener('blur', function() {
                const numero = this.value.trim();
                if (numero) {
                    verificarNumeroDisponible(numero);
                }
            });
        }
    }
    
    // Formulario de edición
    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Enviando formulario de edición...');
            await actualizarHabitacionAJAX(this);
        });
    }
    
    console.log('✅ Formularios AJAX configurados');
}

// ===== FUNCIONES PARA ESTADÍSTICAS =====

async function cargarEstadisticas() {
    try {
        console.log('📊 Cargando estadísticas...');
        
        const response = await fetch('/vistas/api/habitaciones/estadisticas');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            const estadisticasElement = document.getElementById('estadisticas');
            if (estadisticasElement) {
                estadisticasElement.textContent = data.data.texto;
                console.log('✅ Estadísticas actualizadas:', data.data.texto);
            }
            
            // Actualizar contador total
            const contadorElement = document.getElementById('total-contador');
            if (contadorElement) {
                contadorElement.textContent = data.data.total;
            }
        } else {
            console.warn('⚠️ Estadísticas no disponibles:', data.message);
        }
        
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
    }
}

// ===== FUNCIONES PARA CRUD CON API =====

async function crearHabitacionAJAX(form) {
    console.log('🆕 Iniciando creación de habitación...');
    
    const btnCrear = document.getElementById('btnCrear');
    const btnTexto = document.getElementById('btnCrearTexto') || btnCrear?.querySelector('span');
    const btnSpinner = document.getElementById('btnCrearSpinner');
    const mensajeDiv = document.getElementById('mensajeCrear');
    
    // Validación básica
    const numeroInput = form.querySelector('[name="numeroHabitacion"]');
    const capacidadInput = form.querySelector('[name="capacidad"]');
    const precioInput = form.querySelector('[name="precioNoche"]');
    const tipoInput = form.querySelector('[name="tipoHabitacionId"]');
    
    if (!numeroInput.value.trim()) {
        mostrarMensajeModal('❌ El número de habitación es requerido', 'danger', mensajeDiv);
        return;
    }
    
    if (!tipoInput.value) {
        mostrarMensajeModal('❌ El tipo de habitación es requerido', 'danger', mensajeDiv);
        return;
    }
    
    if (!capacidadInput.value || capacidadInput.value < 1) {
        mostrarMensajeModal('❌ La capacidad debe ser al menos 1', 'danger', mensajeDiv);
        return;
    }
    
    if (!precioInput.value || precioInput.value <= 0) {
        mostrarMensajeModal('❌ El precio debe ser mayor a 0', 'danger', mensajeDiv);
        return;
    }
    
    // Deshabilitar botón y mostrar spinner
    if (btnTexto) btnTexto.textContent = 'Guardando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnCrear) btnCrear.disabled = true;
    
    try {
        // Preparar datos
        const datos = {
            numeroHabitacion: numeroInput.value.trim(),
            tipoHabitacionId: parseInt(tipoInput.value),
            piso: form.querySelector('[name="piso"]').value ? parseInt(form.querySelector('[name="piso"]').value) : null,
            capacidad: parseInt(capacidadInput.value),
            precioNoche: parseFloat(precioInput.value),
            caracteristicas: form.querySelector('[name="caracteristicas"]').value,
            estadoHabitacionId: 1 // Siempre habilitada al crear
        };
        
        console.log('📤 Enviando datos:', datos);
        
        // Enviar a la API
        const response = await fetch('/vistas/api/habitaciones', {
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
                        cargarComponente('habitaciones');
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

async function actualizarHabitacionAJAX(form) {
    console.log('🔄 Iniciando actualización de habitación...');
    
    // Obtener ID del input hidden
    const idInput = form.querySelector('[name="id"]');
    const id = idInput ? idInput.value : null;
    
    if (!id) {
        alert('❌ No se pudo obtener el ID de la habitación');
        console.error('Input con name="id" no encontrado en el formulario');
        return;
    }
    
    console.log('📋 ID encontrado para actualizar:', id);
    
    const btnActualizar = document.getElementById('btnActualizar');
    const btnTexto = document.getElementById('btnActualizarTexto') || btnActualizar?.querySelector('span');
    const btnSpinner = document.getElementById('btnActualizarSpinner');
    
    // Deshabilitar botón y mostrar spinner
    if (btnTexto) btnTexto.textContent = 'Actualizando...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnActualizar) btnActualizar.disabled = true;
    
    try {
        // Preparar datos
        const formData = new FormData(form);
        const datos = {};
        
        formData.forEach((value, key) => {
            if (key === 'tipoHabitacionId' || key === 'piso' || key === 'capacidad' || key === 'estadoHabitacionId') {
                datos[key] = value ? parseInt(value) : null;
            } else if (key === 'precioNoche') {
                datos[key] = value ? parseFloat(value) : 0;
            } else if (key !== 'id') {
                datos[key] = value;
            }
        });
        
        console.log('📤 Actualizando datos para ID:', id, datos);
        
        // Enviar a la API (PUT)
        const response = await fetch(`/vistas/api/habitaciones/${id}`, {
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
            // Mostrar notificación
            if (window.mostrarNotificacion) {
                mostrarNotificacion('✅ ' + resultado.message, 'success');
            } else {
                alert('✅ ' + resultado.message);
            }
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
            if (modal) modal.hide();
            
            // Recargar el componente
            setTimeout(() => {
                if (typeof recargarComponenteActual === 'function') {
                    recargarComponenteActual();
                } else {
                    cargarComponente('habitaciones');
                }
            }, 1000);
            
        } else {
            if (window.mostrarNotificacion) {
                mostrarNotificacion('❌ ' + resultado.message, 'danger');
            } else {
                alert('❌ ' + resultado.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error en actualización:', error);
        
        if (window.mostrarNotificacion) {
            mostrarNotificacion('❌ Error de conexión: ' + error.message, 'danger');
        } else {
            alert('❌ Error de conexión: ' + error.message);
        }
        
    } finally {
        // Restaurar botón
        if (btnTexto) btnTexto.textContent = 'Actualizar';
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnActualizar) btnActualizar.disabled = false;
    }
}

async function cargarHabitacionParaEditar(id) {
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
        const response = await fetch(`/vistas/api/habitaciones/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.success) {
            const habitacion = resultado.data;
            console.log('✅ Habitación cargada:', habitacion);
            
            // Formatear precio
            const precioFormateado = habitacion.precioNoche ? 
                parseFloat(habitacion.precioNoche).toFixed(2) : '0.00';
            
            // Crear formulario de edición
            const formulario = `
                <div class="row g-3">
                    <input type="hidden" name="id" value="${habitacion.id}">
                    
                    <div class="col-md-6">
                        <label class="form-label">Número de Habitación *</label>
                        <input type="text" class="form-control" name="numeroHabitacion" 
                               value="${habitacion.numeroHabitacion || ''}" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Tipo de Habitación *</label>
                        <select class="form-select" name="tipoHabitacionId" required>
                            <option value="">Seleccione...</option>
                            <option value="1" ${habitacion.tipoHabitacionId == 1 ? 'selected' : ''}>Sencilla</option>
                            <option value="2" ${habitacion.tipoHabitacionId == 2 ? 'selected' : ''}>Doble</option>
                            <option value="3" ${habitacion.tipoHabitacionId == 3 ? 'selected' : ''}>Suite</option>
                            <option value="4" ${habitacion.tipoHabitacionId == 4 ? 'selected' : ''}>Familiar</option>
                        </select>
                    </div>
                    
                    <div class="col-md-4">
                        <label class="form-label">Piso</label>
                        <input type="number" class="form-control" name="piso" 
                               value="${habitacion.piso || ''}" min="1" max="20">
                    </div>
                    
                    <div class="col-md-4">
                        <label class="form-label">Capacidad *</label>
                        <input type="number" class="form-control" name="capacidad" 
                               value="${habitacion.capacidad || 1}" min="1" max="10" required>
                    </div>
                    
                    <div class="col-md-4">
                        <label class="form-label">Precio por Noche *</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" name="precioNoche" 
                                   value="${precioFormateado}" step="0.01" min="0" required>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label class="form-label">Características</label>
                        <textarea class="form-control" name="caracteristicas" rows="3">${habitacion.caracteristicas || ''}</textarea>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Estado</label>
                        <select class="form-select" name="estadoHabitacionId">
                            <option value="1" ${habitacion.estadoHabitacionId == 1 ? 'selected' : ''}>Habilitada</option>
                            <option value="2" ${habitacion.estadoHabitacionId == 2 ? 'selected' : ''}>Inhabilitada</option>
                        </select>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">ID</label>
                        <p class="form-control-plaintext">${habitacion.id}</p>
                    </div>
                </div>
            `;
            
            if (contenidoEditar) {
                contenidoEditar.innerHTML = formulario;
            }
            
            // Actualizar action del formulario (por compatibilidad)
            const formEditar = document.getElementById('formEditar');
            if (formEditar) {
                formEditar.action = `/vistas/habitaciones/actualizar/${id}`;
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
                    <button class="btn btn-sm btn-warning" onclick="cargarHabitacionParaEditar(${id})">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

async function cargarDetallesHabitacion(id) {
    console.log(`👁️ Cargando detalles habitación ${id}...`);
    
    try {
        const response = await fetch(`/vistas/api/habitaciones/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.success) {
            const habitacion = resultado.data;
            
            const estado = habitacion.estadoHabitacionId == 1 ? 
                '<span class="badge bg-success">🟢 Habilitada</span>' : 
                '<span class="badge bg-danger">🔴 Inhabilitada</span>';
            
            const contenido = `
                <div class="row">
                    <div class="col-12 text-center mb-3">
                        <h4 class="text-primary">🏨 Habitación ${habitacion.numeroHabitacion}</h4>
                        ${estado}
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Información General</h6>
                                <p><strong>Piso:</strong> ${habitacion.piso || 'No especificado'}</p>
                                <p><strong>Tipo:</strong> ${obtenerNombreTipo(habitacion.tipoHabitacionId)}</p>
                                <p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>
                                <p><strong>ID:</strong> ${habitacion.id}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Información Económica</h6>
                                <p><strong>Precio/Noche:</strong> 
                                   <span class="text-success fw-bold">
                                       $${parseFloat(habitacion.precioNoche).toLocaleString('es-CO')}
                                   </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Características</h6>
                                <p>${habitacion.caracteristicas || 'Sin características especificadas'}</p>
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

// ===== FUNCIONES PARA CAMBIAR ESTADO =====

function confirmarCambioEstado(id, accion) {
    const texto = accion === 'inhabilitar' ? 'inhabilitar' : 'habilitar';
    const mensaje = `¿Está seguro de que desea ${texto} esta habitación?`;
    
    if (confirm(mensaje)) {
        console.log(`🔄 ${accion === 'inhabilitar' ? 'Inhabilitando' : 'Habilitando'} ID: ${id}`);
        cambiarEstadoHabitacion(id, accion);
    }
}

async function cambiarEstadoHabitacion(id, accion) {
    try {
        const endpoint = accion === 'inhabilitar' ? 'inhabilitar' : 'habilitar';
        const url = `/vistas/api/habitaciones/${id}/${endpoint}`;
        
        console.log(`📤 Cambiando estado - URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        const resultado = await response.json();
        console.log('📥 Respuesta cambio estado:', resultado);
        
        if (resultado.success) {
            // Mostrar notificación
            const mensaje = accion === 'inhabilitar' ? 
                'Habitación inhabilitada exitosamente!' : 
                'Habitación habilitada exitosamente!';
            
            if (window.mostrarNotificacion) {
                mostrarNotificacion('✅ ' + mensaje, 'success');
            } else {
                alert('✅ ' + mensaje);
            }
            
            // Recargar componente
            setTimeout(() => {
                if (typeof recargarComponenteActual === 'function') {
                    recargarComponenteActual();
                } else {
                    cargarComponente('habitaciones');
                }
            }, 1000);
            
        } else {
            throw new Error(resultado.message);
        }
        
    } catch (error) {
        console.error('❌ Error cambiando estado:', error);
        
        if (window.mostrarNotificacion) {
            mostrarNotificacion('❌ Error: ' + error.message, 'danger');
        } else {
            alert('❌ Error: ' + error.message);
        }
    }
}

// ===== FUNCIONES AUXILIARES =====

function obtenerNombreTipo(tipoId) {
    const tipos = {
        1: 'Sencilla',
        2: 'Doble', 
        3: 'Suite',
        4: 'Familiar'
    };
    return tipos[tipoId] || `Tipo ${tipoId}`;
}

async function verificarNumeroDisponible(numero) {
    try {
        const response = await fetch(`/vistas/api/habitaciones/verificar-numero/${numero}`);
        const resultado = await response.json();
        
        const mensajeDiv = document.getElementById('mensajeCrear');
        if (mensajeDiv && resultado.data) {
            mostrarMensajeModal('⚠️ ' + resultado.message, 'warning', mensajeDiv);
        }
    } catch (error) {
        console.error('Error verificando número:', error);
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
window.inicializarHabitaciones = inicializarHabitaciones;
window.cargarHabitacionParaEditar = cargarHabitacionParaEditar;
window.cargarDetallesHabitacion = cargarDetallesHabitacion;
window.confirmarCambioEstado = confirmarCambioEstado;
window.crearHabitacionAJAX = crearHabitacionAJAX;
window.actualizarHabitacionAJAX = actualizarHabitacionAJAX;
window.mostrarMensajeModal = mostrarMensajeModal;

// Inicializar cuando el script se cargue
console.log('✅ habitaciones.js cargado - Módulo listo');

// Si estamos en el contexto de habitaciones, inicializar automáticamente
if (document.getElementById('habitaciones-container')) {
    console.log('🔍 Detectado contenedor de habitaciones - Inicializando...');
    setTimeout(() => {
        if (typeof inicializarHabitaciones === 'function') {
            inicializarHabitaciones();
        }
    }, 300);
}

// Exportar para módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inicializarHabitaciones,
        cargarEstadisticas,
        cargarHabitacionParaEditar,
        cargarDetallesHabitacion,
        crearHabitacionAJAX,
        actualizarHabitacionAJAX
    };
}
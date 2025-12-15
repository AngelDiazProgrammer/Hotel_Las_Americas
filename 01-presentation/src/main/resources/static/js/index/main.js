// ==========================================================
// main.js - Funcionalidades Globales para el SPA con AJAX
// ==========================================================

let componenteActual = 'dashboard'; // Variable global para saber qué fragmento está cargado

// Contenedores principales (asegúrate de que existan en tu HTML principal)
const appView = document.getElementById('appView');
const homeContent = document.getElementById('homeContent');
const loader = document.getElementById('loader');
const contentContainer = document.querySelector('.content-container');
const alertMessagesContainer = document.getElementById('alert-messages-container');

// ===== FUNCIÓN GLOBAL 1: CARGAR CUALQUIER COMPONENTE/FRAGMENTO VÍA AJAX =====

/**
 * Carga un fragmento de vista de Thymeleaf vía AJAX en el contenedor principal.
 * @param {string} nombreComponente El nombre de la vista (ej. 'reservas', 'huespedes').
 * @param {number} [pagina=0] La página a cargar, por defecto 0.
 */
function cargarComponente(nombreComponente, pagina = 0) {
    if (!appView || !loader || !contentContainer) {
        console.error('Error: Contenedores principales (appView, loader, contentContainer) no encontrados.');
        return;
    }

    console.log(`📡 Solicitando fragmento: ${nombreComponente} (Página: ${pagina})`);

    // 1. Mostrar loader y ocultar vistas
    if (homeContent) homeContent.style.display = 'none';
    appView.style.display = 'none';
    loader.style.display = 'block';

    // 2. Determinar la URL del fragmento
    // Usamos el endpoint del Controller que devuelve el fragmento (ej: /reservas/fragment?pagina=0)
    const url = `/${nombreComponente}/fragment?pagina=${pagina}`;
    
    // 3. Petición AJAX (Fetch API)
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es 200, lanzamos un error
                throw new Error(`Error HTTP ${response.status} al cargar el componente.`);
            }
            return response.text();
        })
        .then(html => {
            // 4. Inyectar el HTML en el contenedor
            appView.innerHTML = html;
            appView.style.display = 'block';
            
            // 5. Actualizar estado global y navegación
            componenteActual = nombreComponente;
            actualizarEstadoNavbar(nombreComponente);
            
            // 6. Scroll al inicio
            contentContainer.scrollTop = 0;
            
            console.log(`✅ Fragmento de ${nombreComponente} cargado con éxito.`);
        })
        .catch(error => {
            console.error(`❌ Error al cargar el componente ${nombreComponente}:`, error);
            appView.innerHTML = `
                <div class="alert alert-danger mt-4" role="alert">
                    <h5>Error de Carga</h5>
                    <p>No se pudo cargar la vista de ${nombreComponente}. Verifique la conexión al backend y la URL: ${url}.</p>
                </div>
            `;
            appView.style.display = 'block';
        })
        .finally(() => {
            // 7. Ocultar loader
            loader.style.display = 'none';
        });
}

// ===== FUNCIÓN GLOBAL 2: CARGA COMPONENTE CON PARÁMETROS ESPECÍFICOS =====

/**
 * Función wrapper para cargar un componente con un número de página específico.
 * Utilizada por los enlaces de paginación dentro de los fragmentos (ej. reservas.js).
 */
function cargarComponenteConPagina(nombreComponente, pagina) {
    cargarComponente(nombreComponente, pagina);
}


// ===== FUNCIÓN GLOBAL 3: RECAGAR COMPONENTE ACTUAL (Después de un CRUD) =====

/**
 * Recarga el fragmento actualmente cargado sin cambiar la página.
 */
function recargarComponenteActual() {
    if (componenteActual && componenteActual !== 'dashboard') {
        console.log(`🔄 Recargando componente actual: ${componenteActual}`);
        // Asumimos que la paginación se resetea a la página 0 después de una operación CRUD
        cargarComponente(componenteActual, 0); 
    } else {
        // Si estamos en el dashboard, simplemente nos aseguramos de que se muestre
        showHome(); 
    }
}

// ===== FUNCIÓN GLOBAL 4: MOSTRAR ALERTA (Para mensajes post-AJAX) =====

/**
 * Muestra un mensaje de alerta en el contenedor global.
 * @param {string} mensaje El texto del mensaje.
 * @param {string} tipo Tipo de alerta (success, danger, warning, info).
 * @param {number} duracion Duración en milisegundos para ocultar la alerta (0 para permanente).
 */
function mostrarAlertaGlobal(mensaje, tipo, duracion = 5000) {
    if (!alertMessagesContainer) {
        console.warn('Contenedor de alertas global (#alert-messages-container) no encontrado.');
        return;
    }
    
    // Crear el elemento de alerta
    const alertHtml = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <span>${mensaje}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Inyectar y mostrar
    alertMessagesContainer.innerHTML = alertHtml;
    
    // Ocultar automáticamente si la duración es > 0
    if (duracion > 0) {
        setTimeout(() => {
            const alertElement = alertMessagesContainer.querySelector('.alert');
            if (alertElement) {
                // Usar la API de Bootstrap para cerrar
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
                bsAlert.close();
            }
        }, duracion);
    }
}


// ===== FUNCIÓN DE UTILIDAD: Mostrar mensajes dentro de Modales =====

/**
 * Muestra un mensaje de alerta dentro de un modal.
 * @param {string} mensaje El texto del mensaje.
 * @param {string} tipo Tipo de alerta (success, danger, warning, info).
 * @param {HTMLElement} contenedorDiv El div donde se mostrará el mensaje (ej. #mensajeEditarReserva).
 */
function mostrarMensajeModal(mensaje, tipo, contenedorDiv) {
    if (contenedorDiv) {
        contenedorDiv.className = `alert alert-${tipo} mt-3`;
        contenedorDiv.innerHTML = `<strong>${mensaje}</strong>`;
        contenedorDiv.style.display = 'block';
    }
}


// ===== FUNCIÓN DE UTILIDAD: Actualizar el estado activo de la barra de navegación =====

/**
 * Actualiza la clase 'active' en el enlace de navegación correspondiente.
 * @param {string} nombreComponente El nombre del componente cargado.
 */
function actualizarEstadoNavbar(nombreComponente) {
    const navLinks = document.querySelectorAll('.navbar-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Buscar el enlace que coincida con el nombre del componente
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`cargarComponente('${nombreComponente}'`)) {
            link.classList.add('active');
        }
    });
}


// ===== FUNCIONES ORIGINALES MODIFICADAS/MANTENIDAS =====

// Función para mostrar el dashboard (mantener)
function showHome() {
    if (!homeContent || !appView || !contentContainer) return;

    appView.style.display = 'none';
    homeContent.style.display = 'block';
    componenteActual = 'dashboard';
    
    // Actualizar estado activo en la navbar
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    const dashboardLink = document.querySelector('a[onclick="showHome()"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
    }
    
    // Scroll al inicio
    contentContainer.scrollTop = 0;
}


// Inicialización (mantener)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hotel Las Américas - Sistema SPA cargado');
    
    // Ajustar layout inicial
    adjustLayout();
    
    // Configurar eventos
    setupEventListeners();
    
    // Asegurarse de que el contenedor de alertas existe
    if (!alertMessagesContainer && appView) {
        // Crear el contenedor de mensajes de alerta global si no existe
        const alertDiv = document.createElement('div');
        alertDiv.id = 'alert-messages-container';
        appView.parentNode.insertBefore(alertDiv, appView);
    }
    
    // Forzar scroll al inicio
    setTimeout(() => {
        if (contentContainer) contentContainer.scrollTop = 0;
    }, 100);
});

// Función para ajustar el layout (mantener)
function adjustLayout() {
    if (contentContainer) {
        const viewportHeight = window.innerHeight;
        // Ajustar max-height del contenedor de contenido (asumiendo que tiene overflow)
        // Puedes refinar esto basándote en la altura de tu barra de navegación/encabezado
        contentContainer.style.maxHeight = viewportHeight + 'px'; 
    }
}

// Configurar event listeners (mantener)
function setupEventListeners() {
    window.addEventListener('resize', adjustLayout);
    
    const logoutLink = document.querySelector('a[href="/auth/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                e.preventDefault();
            }
        });
    }
}

// Función para hacer scroll al inicio del contenido (mantener)
function scrollToTop() {
    if (contentContainer) {
        contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Función para hacer scroll al final del contenido (mantener)
function scrollToBottom() {
    if (contentContainer) {
        contentContainer.scrollTo({ top: contentContainer.scrollHeight, behavior: 'smooth' });
    }
}
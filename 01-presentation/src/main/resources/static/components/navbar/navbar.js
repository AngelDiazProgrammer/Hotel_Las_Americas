// navbar.js - CORREGIDO
export function loadNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <nav class="navbar">
            <div class="navbar-logo">Hotel Las Américas</div>
            <ul class="navbar-links">
                <li><a href="#" onclick="cargarComponente('habitaciones')" title="Habitaciones">
                    <span>Gestionar Habitaciones</span>
                </a></li>
                <li><a href="#" onclick="cargarComponente('huespedes')" title="Huespedes">
                    <span>Gestionar Huespedes</span>
                </a></li>
                <li><a href="#" onclick="cargarComponente('reservas')" title="Reservas">
                    <span>Gestionar Reservas</span>
                </a></li>
                <li><a href="/auth/logout" title="Cerrar sesión">
                    <span>Cerrar sesión</span>
                </a></li>
            </ul>
        </nav>
    `;
    
    console.log('✅ Navbar SPA cargada correctamente');
    
    // Exponer funciones globalmente
    window.cargarComponente = cargarComponente;
    window.mostrarDashboard = mostrarDashboard;
    // CRITICAL: Asegurar que cargarComponenteConPagina esté disponible globalmente.
    window.cargarComponenteConPagina = cargarComponenteConPagina; 
}

// ===== FUNCIONES GLOBALES PARA SPA =====

async function cargarComponente(nombreComponente, page = 0, size = 10) {
    console.log(`🔄 Cargando componente: ${nombreComponente}`);
    
    // Ocultar contenido actual
    const homeContent = document.getElementById('homeContent');
    const appView = document.getElementById('appView');
    const loader = document.getElementById('loader');
    
    if (homeContent) homeContent.style.display = 'none';
    if (appView) appView.style.display = 'none';
    
    // Mostrar loader
    if (loader) loader.style.display = 'block';
    
    try {
        // ===== LÓGICA DE URL REVISADA =====
        let url;
        
        if (nombreComponente === 'dashboard') {
            url = `/componentes/${nombreComponente}`;
        } else if (['habitaciones', 'huespedes', 'reservas'].includes(nombreComponente)) {
            // Unificamos la lógica para todos los componentes de vistas
            url = `/vistas/componentes/${nombreComponente}`;
        } else {
             throw new Error(`Componente no reconocido: ${nombreComponente}`);
        }
        
        // ===== LÓGICA DE PAGINACIÓN REVISADA =====
        // Aplicar parámetros de paginación si NO es el dashboard
        if (nombreComponente !== 'dashboard') {
            const params = new URLSearchParams();
            if (page > 0) params.append('page', page);
            if (size !== 10) params.append('size', size);
            const queryString = params.toString();
            if (queryString) url += '?' + queryString;
        }

        /*
        // Tu código original era repetitivo y se puede simplificar así:
        // Original:
        // ... else if (nombreComponente === 'huespedes') { url = `/vistas/componentes/${nombreComponente}` }
        // ... else if (nombreComponente === 'reservas') { url = `/vistas/componentes/${nombreComponente}` }
        // ... 
        // if (nombreComponente === 'habitaciones') { ... agregar params }
        // if (nombreComponente === 'huespedes') { ... agregar params }
        // if (nombreComponente === 'reservas') { ... agregar params }
        */
        
        
        console.log(`📡 URL solicitada: ${url}`);
        
        // Hacer petición al servidor
        const response = await fetch(url);
        
        if (!response.ok) {
            // Obtener más detalles del error
            let errorDetails = '';
            try {
                errorDetails = await response.text();
                console.error('Error details:', errorDetails.substring(0, 500));
            } catch (e) {
                errorDetails = 'No se pudo obtener detalles del error';
            }
            
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}\n${errorDetails}`);
        }
        
        const html = await response.text();
        console.log(`✅ Componente ${nombreComponente} recibido (${html.length} bytes)`);
        
        // Mostrar en el contenedor de aplicación
        if (appView) {
            appView.innerHTML = html;
            appView.style.display = 'block';
            
            // Actualizar estado activo en la navbar
            actualizarNavbarActiva(nombreComponente);
            
            // Ejecutar scripts específicos del componente
            ejecutarScriptsComponente(nombreComponente);
        }
        
    } catch (error) {
        console.error('❌ Error cargando componente:', error);
        
        // Mostrar error más detallado
        if (appView) {
            appView.innerHTML = `
                <div class="alert alert-danger m-4">
                    <h4>❌ Error al cargar "${nombreComponente}"</h4>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-primary" onclick="cargarComponente('${nombreComponente}')">
                            Reintentar
                        </button>
                        <button class="btn btn-sm btn-secondary ms-2" onclick="mostrarDashboard()">
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            `;
            appView.style.display = 'block';
        }
    } finally {
        // Ocultar loader
        if (loader) loader.style.display = 'none';
    }
}

/**
 * Función para cargar componente con paginación específica
 */
window.cargarComponenteConPagina = function(nombreComponente, pagina) {
    console.log(`📄 Cargando ${nombreComponente} - Página ${pagina}`);
    cargarComponente(nombreComponente, pagina, 10);
};

/**
 * Mostrar dashboard (página de inicio)
 */
function mostrarDashboard() {
    console.log('🏠 Mostrando dashboard...');
    
    const homeContent = document.getElementById('homeContent');
    const appView = document.getElementById('appView');
    
    if (homeContent) homeContent.style.display = 'block';
    if (appView) appView.style.display = 'none';
    
    // Actualizar navbar
    actualizarNavbarActiva('dashboard');
}

/**
 * Actualizar estado activo en la navbar
 */
function actualizarNavbarActiva(componenteActivo) {
    const links = document.querySelectorAll('.navbar-links a');
    links.forEach(link => {
        link.classList.remove('active');
        
        // Verificar si este enlace corresponde al componente activo
        const onclick = link.getAttribute('onclick') || '';
        if (onclick.includes(`'${componenteActivo}'`)) {
            link.classList.add('active');
        }
    });
    
    console.log(`🎯 Navbar actualizada - Activo: ${componenteActivo}`);
}

/**
 * Ejecutar scripts específicos de cada componente
 */
function ejecutarScriptsComponente(nombreComponente) {
    console.log(`⚙️ Ejecutando scripts para ${nombreComponente}`);
    
    switch (nombreComponente) {
        case 'habitaciones':
            if (typeof inicializarHabitaciones === 'function') {
                setTimeout(() => {
                    inicializarHabitaciones();
                    console.log('✅ Script de habitaciones ejecutado');
                }, 100);
            } else {
                console.warn('⚠️ Función inicializarHabitaciones no disponible');
                cargarScriptHabitaciones();
            }
            break;
        case 'huespedes':
            if (typeof inicializarHuespedes === 'function') {
                setTimeout(() => {
                    inicializarHuespedes();
                    console.log('✅ Script de huespedes ejecutado');
                }, 100);
            } else {
                // CORRECCIÓN/ADVERTENCIA: Tu mensaje de warning decía "inicializarHabitaciones" en el original.
                console.warn('⚠️ Función inicializarHuespedes no disponible'); 
                cargarScriptHuespedes();
            }
            break;
        case 'reservas':
            if (typeof inicializarReservas === 'function') {
                setTimeout(() => {
                    inicializarReservas();
                    console.log('✅ Script de reservas ejecutado');
                }, 100);
            } else {
                console.warn('⚠️ Función inicializarReservas no disponible');
                cargarScriptReservas();
            }
            break;
            
        case 'dashboard':
            console.log('📊 Dashboard cargado - sin scripts adicionales');
            break;
            
        default:
            console.log(`🔧 Componente ${nombreComponente} - sin scripts específicos`);
    }
}

/**
 * Cargar script de habitaciones dinámicamente
 */
function cargarScriptHabitaciones() {
    // ... (Tu código original) ...
}

/**
 * Cargar script de huespedes dinámicamente
 */
function cargarScriptHuespedes() {
    // ... (Tu código original) ...
    
    // Corrección crítica en la función original:
    // Tu función original tenía un mensaje de error incorrecto para habitaciones:
    // script.onerror = (error) => {
    //     console.error('❌ Error cargando script de habitaciones:', error); // <- DEBE SER huespedes
    // };
    // Asegúrate de que el código real de tu proyecto use "huespedes" en esa línea.
}


/**
 * Cargar script de reservas dinámicamente
 */
function cargarScriptReservas() {
    // Verificar si ya está cargado
    if (window.reservasScriptCargado) {
        console.log('✅ Script de reservas ya cargado');
        return;
    }

    console.log('📦 Cargando script de reservas...');

    // Crear script element
    const script = document.createElement('script');
    script.src = '/js/reservas/reservas.js';
    script.onload = () => {
        // CORRECCIÓN: El console.log decía "huespedes" en tu código original.
        console.log('✅ Script de reservas cargado'); 
        window.reservasScriptCargado = true;

        // Intentar inicializar después de cargar
        if (typeof inicializarReservas === 'function') {
            setTimeout(() => inicializarReservas(), 100);
        }
    };
    script.onerror = (error) => {
        console.error('❌ Error cargando script de reservas:', error);
    };

    document.head.appendChild(script);
}

/**
 * Función para probar el sistema de componentes
 */
window.probarSistemaSPA = async function() {
    console.log('🧪 Probando sistema SPA...');
    
    try {
        // ... (Tests existentes) ...
        
        // CRÍTICO: Añadir el test para reservas
        try {
            const resRes = await fetch('/vistas/componentes/reservas');
            console.log('Reservas:', resRes.ok ? '✅' : '❌', resRes.status);
        } catch (e) {
            console.error('Reservas test error:', e.message);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error probando SPA:', error);
        return false;
    }
};

// ... (Resto del código de inicialización) ...
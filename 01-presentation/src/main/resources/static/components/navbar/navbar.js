// navbar.js - CORREGIDO
export function loadNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <nav class="navbar">
            <div class="navbar-logo">Hotel Las Américas</div>
            <ul class="navbar-links">
                <li><a href="#" onclick="cargarComponente('dashboard')" class="active" title="Dashboard">
                    <span>Dashboard</span>
                </a></li>
                <li><a href="#" onclick="cargarComponente('habitaciones')" title="Habitaciones">
                    <span>Habitaciones</span>
                </a></li>
                <li><a href="#" onclick="cargarComponente('huespedes')" title="Huespedes">
                    <span>Huespedes</span>
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
        // ===== CORRECCIÓN PRINCIPAL =====
        // URL diferente para dashboard vs habitaciones
        let url;
        if (nombreComponente === 'dashboard') {
            url = `/componentes/${nombreComponente}`;
        } else if (nombreComponente === 'habitaciones') {
            // Para habitaciones usa la ruta con /vistas/
            url = `/vistas/componentes/${nombreComponente}`;
        }
        else if (nombreComponente === 'huespedes') {
            // Para huespedes usa la ruta con /vistas/
            url = `/vistas/componentes/${nombreComponente}`;
        }

         else {
            throw new Error(`Componente no reconocido: ${nombreComponente}`);
        }
        
        // Agregar parámetros de paginación solo para habitaciones
        if (nombreComponente === 'habitaciones') {
            const params = new URLSearchParams();
            if (page > 0) params.append('page', page);
            if (size !== 10) params.append('size', size);
            const queryString = params.toString();
            if (queryString) url += '?' + queryString;
        }


             if (nombreComponente === 'huespedes') {
                    const params = new URLSearchParams();
                    if (page > 0) params.append('page', page);
                    if (size !== 10) params.append('size', size);
                    const queryString = params.toString();
                    if (queryString) url += '?' + queryString;
                }
        
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
            // Inicializar módulo de habitaciones si existe
            if (typeof inicializarHabitaciones === 'function') {
                setTimeout(() => {
                    inicializarHabitaciones();
                    console.log('✅ Script de habitaciones ejecutado');
                }, 100);
            } else {
                console.warn('⚠️ Función inicializarHabitaciones no disponible');
                
                // Cargar script dinámicamente si no está disponible
                cargarScriptHabitaciones();
            }
            break;
        case 'huespedes':
                    // Inicializar módulo de habitaciones si existe
                    if (typeof inicializarHuespedes === 'function') {
                        setTimeout(() => {
                            inicializarHuespedes();
                            console.log('✅ Script de huespedes ejecutado');
                        }, 100);
                    } else {
                        console.warn('⚠️ Función inicializarHabitaciones no disponible');

                        // Cargar script dinámicamente si no está disponible
                        cargarScriptHuespedes();
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
    // Verificar si ya está cargado
    if (window.habitacionesScriptCargado) {
        console.log('✅ Script de habitaciones ya cargado');
        return;
    }
    
    console.log('📦 Cargando script de habitaciones...');
    
    // Crear script element
    const script = document.createElement('script');
    script.src = '/js/habitaciones.js';
    script.onload = () => {
        console.log('✅ Script de habitaciones cargado');
        window.habitacionesScriptCargado = true;
        
        // Intentar inicializar después de cargar
        if (typeof inicializarHabitaciones === 'function') {
            setTimeout(() => inicializarHabitaciones(), 100);
        }
    };
    
    script.onerror = (error) => {
        console.error('❌ Error cargando script de habitaciones:', error);
    };
    
    document.head.appendChild(script);
}

function cargarScriptHuespedes() {
    // Verificar si ya está cargado
    if (window.huespedesScriptCargado) {
        console.log('✅ Script de huespedes ya cargado');
        return;
    }

    console.log('📦 Cargando script de huespedes...');

    // Crear script element
    const script = document.createElement('script');
    script.src = '/js/huespedes.js';
    script.onload = () => {
        console.log('✅ Script de huespedes cargado');
        window.huespedesScriptCargado = true;

        // Intentar inicializar después de cargar
        if (typeof inicializarHuespedes === 'function') {
            setTimeout(() => inicializarHuespedes(), 100);
        }
    };

    script.onerror = (error) => {
        console.error('❌ Error cargando script de habitaciones:', error);
    };

    document.head.appendChild(script);
}

/**
 * Función para probar el sistema de componentes
 */
window.probarSistemaSPA = async function() {
    console.log('🧪 Probando sistema SPA...');
    
    try {
        // Probar endpoint de test
        const response = await fetch('/componentes/test');
        const data = await response.json();
        console.log('✅ Test SPA:', data);
        
        // Probar endpoint de salud
        const health = await fetch('/health');
        const healthData = await health.json();
        console.log('✅ Health check:', healthData);
        
        // Probar componentes individualmente
        console.log('🧪 Probando componentes...');
        
        // Probar dashboard
        try {
            const dashRes = await fetch('/componentes/dashboard');
            console.log('Dashboard:', dashRes.ok ? '✅' : '❌', dashRes.status);
        } catch (e) {
            console.error('Dashboard test error:', e.message);
        }
        
        // Probar habitaciones
        try {
            const habRes = await fetch('/vistas/componentes/habitaciones');
            console.log('Habitaciones:', habRes.ok ? '✅' : '❌', habRes.status);
        } catch (e) {
            console.error('Habitaciones test error:', e.message);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error probando SPA:', error);
        return false;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Sistema SPA listo');
        
        // Opcional: Probar sistema al cargar
        setTimeout(() => {
            probarSistemaSPA();
        }, 1000);
    });
} else {
    console.log('🚀 Sistema SPA listo (DOM ya cargado)');
}

// Asegurar que showHome esté disponible
if (!window.showHome) {
    window.showHome = mostrarDashboard;
}
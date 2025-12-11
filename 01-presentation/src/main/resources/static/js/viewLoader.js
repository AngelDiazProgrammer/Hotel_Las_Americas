// spa-loader.js - Sistema de carga para SPA
console.log('📦 Cargador SPA inicializado');

// Mantener compatibilidad con funciones existentes
export function loadView(url) {
    console.log(`⚠️ loadView obsoleto - URL: ${url}`);
    
    // Intentar determinar qué componente cargar basado en la URL
    if (url.includes('/vistas/habitaciones')) {
        console.log('🔀 Redirigiendo a componente SPA: habitaciones');
        if (typeof cargarComponente === 'function') {
            cargarComponente('habitaciones');
        } else {
            console.error('❌ Función cargarComponente no disponible');
        }
    } else {
        console.error(`❌ URL no soportada en SPA: ${url}`);
    }
}

export function showHome() {
    console.log('🏠 showHome llamado');
    if (typeof mostrarDashboard === 'function') {
        mostrarDashboard();
    } else {
        console.warn('⚠️ Función mostrarDashboard no disponible, usando fallback');
        const homeContent = document.getElementById('homeContent');
        const appView = document.getElementById('appView');
        
        if (homeContent) homeContent.style.display = 'block';
        if (appView) appView.style.display = 'none';
    }
}

// Mantener compatibilidad global
window.loadView = loadView;
window.showHome = showHome;

// Función auxiliar para recargar componentes
export async function recargarComponenteActual() {
    console.log('🔄 Recargando componente actual...');
    
    const appView = document.getElementById('appView');
    if (!appView || appView.style.display === 'none') {
        console.log('ℹ️ No hay componente activo para recargar');
        return;
    }
    
    // Intentar determinar qué componente está activo
    const activeLink = document.querySelector('.navbar-links a.active');
    if (activeLink) {
        const onclick = activeLink.getAttribute('onclick') || '';
        const match = onclick.match(/'([^']+)'/);
        
        if (match && match[1]) {
            const componente = match[1];
            console.log(`🔄 Recargando componente: ${componente}`);
            
            if (typeof cargarComponente === 'function') {
                await cargarComponente(componente);
            }
        }
    }
}

window.recargarComponenteActual = recargarComponenteActual;

// Exportar para usar como módulo
export default {
    loadView,
    showHome,
    recargarComponenteActual
};
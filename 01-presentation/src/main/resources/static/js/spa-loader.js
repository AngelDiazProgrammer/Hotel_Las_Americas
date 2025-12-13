// js/spa-loader.js - Sistema principal SPA
console.log('🚀 Sistema SPA Hotel Las Américas cargando...');

// Configuración global
const SPA_CONFIG = {
    debug: true,
    autoTest: true,
    defaultComponent: 'dashboard'
};

// Sistema de notificaciones
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Crear contenedor de notificaciones
        this.container = document.createElement('div');
        this.container.id = 'spa-notifications';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            <span>${message}</span>
            <button type="button" class="btn-close" 
                    onclick="this.parentElement.remove()"></button>
        `;
        alert.style.marginBottom = '10px';
        
        this.container.appendChild(alert);
        
        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, duration);
        }
        
        return alert;
    }
    
    success(message, duration = 3000) {
        return this.show(`✅ ${message}`, 'success', duration);
    }
    
    error(message, duration = 5000) {
        return this.show(`❌ ${message}`, 'danger', duration);
    }
    
    info(message, duration = 3000) {
        return this.show(`ℹ️ ${message}`, 'info', duration);
    }
    
    warning(message, duration = 4000) {
        return this.show(`⚠️ ${message}`, 'warning', duration);
    }
}

// Inicializar sistema de notificaciones
const notificaciones = new NotificationSystem();

// Función global para mostrar notificaciones
window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    notificaciones.show(mensaje, tipo);
};

// Sistema de manejo de errores
window.handleSPAError = function(error, context = 'SPA') {
    console.error(`❌ Error en ${context}:`, error);
    
    let mensaje = error.message || 'Error desconocido';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
        mensaje = 'Error de conexión con el servidor';
    } else if (error.status === 401) {
        mensaje = 'Sesión expirada. Redirigiendo a login...';
        setTimeout(() => {
            window.location.href = '/auth/login';
        }, 2000);
    } else if (error.status === 404) {
        mensaje = 'Recurso no encontrado';
    }
    
    notificaciones.error(`${context}: ${mensaje}`);
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM listo - Sistema SPA activo');
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        notificaciones.success('Sistema SPA cargado correctamente', 2000);
    }, 1000);
    
    // Configurar ajuste de layout
    ajustarLayoutSPA();
    
    // Configurar eventos de redimensionamiento
    window.addEventListener('resize', ajustarLayoutSPA);
});

// Función para ajustar layout en SPA
function ajustarLayoutSPA() {
    const contentContainer = document.querySelector('.content-container');
    const appView = document.getElementById('appView');
    
    if (contentContainer) {
        // Ajustar altura según viewport
        const viewportHeight = window.innerHeight;
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        
        contentContainer.style.maxHeight = `calc(${viewportHeight}px - ${navbarHeight}px)`;
        
        if (SPA_CONFIG.debug) {
            console.log('📐 Layout ajustado:', {
                viewport: viewportHeight,
                navbar: navbarHeight,
                maxHeight: contentContainer.style.maxHeight
            });
        }
    }
    
    // Ajustar altura del appView si está visible
    if (appView && appView.style.display !== 'none') {
        appView.style.minHeight = 'calc(100vh - 200px)';
    }
}

// Exportar para uso modular
export {
    notificaciones,
    ajustarLayoutSPA,
    SPA_CONFIG
};

export default {
    notificaciones,
    config: SPA_CONFIG,
    ajustarLayout: ajustarLayoutSPA
};
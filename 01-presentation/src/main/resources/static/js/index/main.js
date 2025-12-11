// main.js - Funcionalidades para el index

// Función para mostrar el dashboard
function showHome() {
    document.getElementById('appView').style.display = 'none';
    document.getElementById('homeContent').style.display = 'block';
    
    // Actualizar estado activo en la navbar
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    const dashboardLink = document.querySelector('a[onclick="showHome()"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
    }
    
    // Scroll al inicio
    document.querySelector('.content-container').scrollTop = 0;
}

// Función para cargar una vista
function loadView(view) {
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';
    document.getElementById('appView').style.display = 'none';
    document.getElementById('homeContent').style.display = 'none';
    
    // Simular carga
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('appView').style.display = 'block';
        document.getElementById('appView').innerHTML = `
            <div class="container mt-4">
                <h1>Vista de ${view.split('/').pop()}</h1>
                <p>Contenido de la vista cargado dinámicamente.</p>
            </div>
        `;
        
        // Actualizar estado activo en la navbar
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Scroll al inicio
        document.querySelector('.content-container').scrollTop = 0;
    }, 500);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hotel Las Américas - Sistema cargado');
    
    // Ajustar layout inicial
    adjustLayout();
    
    // Configurar eventos
    setupEventListeners();
    
    // Forzar scroll al inicio
    setTimeout(() => {
        document.querySelector('.content-container').scrollTop = 0;
    }, 100);
});

// Función para ajustar el layout
function adjustLayout() {
    const contentContainer = document.querySelector('.content-container');
    const mainContent = document.querySelector('.main-content');
    
    if (contentContainer && mainContent) {
        // Asegurar que el contenedor de contenido tenga altura correcta
        const viewportHeight = window.innerHeight;
        contentContainer.style.maxHeight = viewportHeight + 'px';
        
        console.log('Layout ajustado correctamente');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Redimensionar ventana
    window.addEventListener('resize', adjustLayout);
    
    // Logout
    const logoutLink = document.querySelector('a[href="/auth/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                e.preventDefault();
            }
        });
    }
}

// Función para hacer scroll al inicio del contenido
function scrollToTop() {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Función para hacer scroll al final del contenido
function scrollToBottom() {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.scrollTo({
            top: contentContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
}
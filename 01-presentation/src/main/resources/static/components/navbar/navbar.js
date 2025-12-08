// navbar.js - Componente de navbar compacta (120px)
export function loadNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <nav class="navbar">
            <div class="navbar-logo">Hotel Las Américas</div>
            <ul class="navbar-links">
                <li><a href="#" onclick="showHome()" class="active" title="Dashboard">
                    <span>Dashboard</span>
                </a></li>
                <li><a href="#" onclick="loadView('/vistas/habitaciones')" title="Habitaciones">
                    <span>Habitaciones</span>
                </a></li>
                <li><a href="/auth/logout" title="Cerrar sesión">
                    <span>Cerrar sesión</span>
                </a></li>
            </ul>
        </nav>
    `;
    
    console.log('Navbar compacta (120px) cargada correctamente');
}
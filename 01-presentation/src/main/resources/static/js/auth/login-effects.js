// Efectos interactivos para el login - Optimizado

document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas decorativas (más ligeras)
    createParticles();
    
    // Efecto de carga en el botón
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const btn = document.getElementById('loginBtn');
            const btnText = document.getElementById('btnText');
            const btnLoading = document.getElementById('btnLoading');
            
            if (btn && btnText && btnLoading) {
                btn.disabled = true;
                btn.style.opacity = '0.8';
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
                
                // Simular tiempo de carga (remover en producción)
                setTimeout(() => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btnText.classList.remove('d-none');
                    btnLoading.classList.add('d-none');
                }, 1500);
            }
        });
    }
    
    // Efecto focus en los inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
});

// Función para crear partículas en el fondo (optimizada)
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';
    
    // Menos partículas para mejor rendimiento
    const particleCount = window.innerWidth < 768 ? 10 : 15;
    const colors = ['#FF2E2E', '#D10000', '#FF6B6B'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamaño más pequeño
        const size = Math.random() * 10 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Opacidad más baja
        const opacity = Math.random() * 0.15 + 0.05;
        particle.style.opacity = opacity;
        
        // Color aleatorio
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // Animación más lenta
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}

// Solo recrear partículas si cambia significativamente el tamaño
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createParticles, 250);
});
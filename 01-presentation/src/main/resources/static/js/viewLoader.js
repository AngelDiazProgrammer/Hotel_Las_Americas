export function loadView(url) {
    const appView = document.getElementById('appView');
    const loader = document.getElementById('loader');
    const homeContent = document.getElementById('homeContent');

    loader.style.display = "block";

    fetch(url)
        .then(r => r.text())
        .then(html => {
            appView.innerHTML = html;

            // Ocultar el contenido del index
            homeContent.style.display = "none";

            // Mostrar el módulo cargado
            appView.style.display = "block";
        })
        .catch(err => appView.innerHTML = `<p class="text-danger">${err}</p>`)
        .finally(() => loader.style.display = "none");
}

export function showHome() {
    const appView = document.getElementById('appView');
    const homeContent = document.getElementById('homeContent');

    // Ocultar el módulo y mostrar el index
    appView.style.display = "none";
    homeContent.style.display = "block";
}

window.loadView = loadView;
window.showHome = showHome;

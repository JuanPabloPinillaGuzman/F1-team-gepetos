export class MainMenu extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
  
    render() {
        this.innerHTML = /*html*/ `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <!-- Imagen del logo -->
                <a class="navbar-brand" href="#" id="logo">
                    <img width="80px" src="images/f1.png" alt="F1 Logo">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-seccion="FrmEquipos">Equipos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-seccion="Pilotos">Pilotos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-seccion="Vehiculos">Vehiculos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-seccion="Circuitos">Circuitos</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  
        <!-- Las tarjetas que mostrarán contenido -->
        <div class="card" id="Pilotos" style="display: none;">
            <div class="card-header">Pilotos</div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
        </div>
        <div class="card" id="Vehiculos" style="display: none;">
            <div class="card-header">Vehiculos</div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
        </div>
        <div class="card" id="Circuitos" style="display: none;">
            <div class="card-header">Circuitos</div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
        </div>
        
        <!-- El formulario de equipos se cargará aquí -->
        <frm-equipos id="FrmEquipos" style="display: none;"></frm-equipos>
        `;
  
        this.addEventListeners();
    }
  
    // Agrega los event listeners para los enlaces y el logo
    addEventListeners() {
        const links = this.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => this.showSection(e));
        });
  
        // Agregar el evento para recargar la página al hacer clic en el logo
        const logo = this.querySelector('#logo');
        logo.addEventListener('click', () => {
            location.reload();  // Esto recargará la página
        });
    }
  
    // Función para mostrar la sección correspondiente al hacer clic
    showSection(event) {
        event.preventDefault();
        const section = event.target.getAttribute('data-seccion');
  
        // Oculta todas las secciones
        const allSections = ['FrmEquipos', 'Pilotos', 'Vehiculos', 'Circuitos'];
        allSections.forEach(s => {
            const el = document.querySelector(`#${s}`);
            if (el) el.style.display = 'none';
        });
  
        // Muestra la sección seleccionada
        const sectionToShow = document.querySelector(`#${section}`);
        if (sectionToShow) sectionToShow.style.display = 'block';
    }
  }
  
  // Define el componente personalizado 'main-menu'
  customElements.define('main-menu', MainMenu);
  
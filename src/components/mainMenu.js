export class MainMenu extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.addEventListeners();
    }
  
    render() {
        this.innerHTML = /*html*/ `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">F1 Manager</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-component="equipos">Equipos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-component="pilotos">Pilotos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-component="vehiculos">Vehículos</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  
        <!-- Las tarjetas que mostrarán contenido -->
        <frm-pilotos id="Pilotos" style="display: none;"></frm-pilotos>
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
    }
  
    addEventListeners() {
        const mainContent = document.getElementById('mainContent');
        const links = this.querySelectorAll('.nav-link');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const component = e.target.dataset.component;
                
                // Limpiar contenido anterior
                mainContent.innerHTML = '';
                
                // Mostrar el componente seleccionado
                switch(component) {
                    case 'equipos':
                        mainContent.innerHTML = '<frm-equipos></frm-equipos>';
                        break;
                    case 'pilotos':
                        mainContent.innerHTML = '<frm-pilotos></frm-pilotos>';
                        break;
                    case 'vehiculos':
                        mainContent.innerHTML = '<frm-vehiculos></frm-vehiculos>';
                        break;
                }

                // Actualizar clases active
                links.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
}
  
// Define el componente personalizado 'main-menu'
customElements.define('main-menu', MainMenu);
  
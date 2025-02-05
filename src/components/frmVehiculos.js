export class FrmVehiculos extends HTMLElement {
    constructor() {
        super();
        this.vehiculos = [];
        this.render();
        this.cargarDatos();
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h1 class="display-4 text-light mb-3">Formula 1 - Vehículos 2024</h1>
                    <div class="f1-line"></div>
                </div>
            </div>
            <div class="row" id="vehiculosContainer"></div>
        </div>
        `;
    }

    cargarDatos() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                this.vehiculos = data.vehiculos;
                this.mostrarVehiculos();
            })
            .catch(error => console.error('Error cargando vehículos:', error));
    }

    mostrarVehiculos() {
        const container = this.querySelector('#vehiculosContainer');
        
        this.vehiculos.forEach(vehiculo => {
            const card = document.createElement('div');
            card.classList.add('col-md-6', 'mb-4');
            card.innerHTML = /*html*/ `
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">${vehiculo.equipo} - ${vehiculo.modelo}</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${vehiculo.imagen}" 
                                     class="img-fluid mb-3" 
                                     alt="${vehiculo.modelo}"
                                     style="max-height: 150px; width: auto;">
                            </div>
                            <div class="col-md-8">
                                <h6 class="text-light">Especificaciones Técnicas</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-engine"></i> <strong>Motor:</strong> ${vehiculo.motor}</li>
                                    <li><i class="fas fa-tachometer-alt"></i> <strong>Velocidad Máxima:</strong> ${vehiculo.especificaciones.velocidad_maxima_kmh} km/h</li>
                                    <li><i class="fas fa-stopwatch"></i> <strong>Aceleración 0-100:</strong> ${vehiculo.especificaciones.aceleracion_0_100}s</li>
                                </ul>
                                
                                <h6 class="text-light mt-3">Rendimiento</h6>
                                <div class="accordion" id="accordion${vehiculo.modelo.replace(/\s+/g, '')}">
                                    ${this.crearAccordionItem(vehiculo.modelo, 'normal', vehiculo.rendimiento.conduccion_normal)}
                                    ${this.crearAccordionItem(vehiculo.modelo, 'agresiva', vehiculo.rendimiento.conduccion_agresiva)}
                                    ${this.crearAccordionItem(vehiculo.modelo, 'ahorro', vehiculo.rendimiento.ahorro_combustible)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    crearAccordionItem(modelo, tipo, datos) {
        const id = `${modelo.replace(/\s+/g, '')}${tipo}`;
        return `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}">
                        Modo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                </h2>
                <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#accordion${modelo.replace(/\s+/g, '')}">
                    <div class="accordion-body">
                        <ul class="list-unstyled mb-0">
                            <li><i class="fas fa-gas-pump"></i> <strong>Consumo:</strong> ${datos.consumo_combustible}L/100km</li>
                            <li><i class="fas fa-tachometer-alt"></i> <strong>Desgaste Motor:</strong> ${datos.desgaste_motor}%</li>
                            <li><i class="fas fa-tire"></i> <strong>Desgaste Neumáticos:</strong> ${datos.desgaste_neumaticos}%</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('frm-vehiculos', FrmVehiculos); 
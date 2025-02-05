export class FrmEquipos extends HTMLElement {
    constructor() {
        super();
        this.equipos = [];
        this.pilotos = [];
        this.render();
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h1 class="display-4 text-light mb-3">Formula 1 - Equipos 2024</h1>
                    <div class="f1-line"></div>
                </div>
            </div>
            
            <div class="row">
                <!-- Carta para Ver Equipos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Ver Equipos</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Explora todos los equipos de la temporada 2024</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnVerEquipos">
                                    <i class="fas fa-trophy"></i> Ver Equipos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carta para Registrar Equipos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Registrar Equipo</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Añade un nuevo equipo a la parrilla</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnMostrarRegistro">
                                    <i class="fas fa-plus-circle"></i> Registrar Equipo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Equipos -->
            <div id="equiposRegistrados" class="row mt-4" style="display: none;"></div>

            <!-- Formulario de Registro -->
            <div id="registroEquipo" class="mt-4" style="display: none;">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Registro de Nuevo Equipo</h4>
                    </div>
                    <div class="card-body">
                        <form id="equipoForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="nombre" class="form-label">Nombre del Equipo</label>
                                    <input type="text" class="form-control" id="nombre">
                                </div>
                                <div class="col-md-6">
                                    <label for="pais" class="form-label">País</label>
                                    <input type="text" class="form-control" id="pais">
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="auto" class="form-label">Auto</label>
                                    <input type="text" class="form-control" id="auto">
                                </div>
                                <div class="col-md-6">
                                    <label for="imagen" class="form-label">URL del Logo</label>
                                    <input type="url" class="form-control" id="imagen">
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="piloto1" class="form-label">Piloto 1 (Líder)</label>
                                    <select class="form-select" id="piloto1"></select>
                                </div>
                                <div class="col-md-6">
                                    <label for="piloto2" class="form-label">Piloto 2 (Escudero)</label>
                                    <select class="form-select" id="piloto2"></select>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                <button type="button" class="btn btn-primary me-2" id="guardarEquipo">
                                    <i class="fas fa-save"></i> Guardar
                                </button>
                                <button type="button" class="btn btn-primary" id="cancelarRegistro">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;

        this.cargarDatos();
        this.addEventListeners();
    }

    addEventListeners() {
        // Botones principales
        this.querySelector('#btnVerEquipos')?.addEventListener('click', () => {
            this.querySelector('#equiposRegistrados').style.display = 'flex';
            this.querySelector('#registroEquipo').style.display = 'none';
            this.listarEquipos();
        });

        this.querySelector('#btnMostrarRegistro')?.addEventListener('click', () => {
            this.querySelector('#registroEquipo').style.display = 'block';
            this.querySelector('#equiposRegistrados').style.display = 'none';
            this.cargarPilotosEnSelect();
        });

        // Botón de guardar en el formulario
        this.querySelector('#guardarEquipo')?.addEventListener('click', () => this.guardarEquipo());
    }

    cargarPilotosEnSelect() {
        const selectPiloto1 = this.querySelector('#piloto1');
        const selectPiloto2 = this.querySelector('#piloto2');

        if (selectPiloto1 && selectPiloto2) {
            // Limpiar selects
            selectPiloto1.innerHTML = '<option value="">Seleccione un piloto líder</option>';
            selectPiloto2.innerHTML = '<option value="">Seleccione un piloto escudero</option>';

            // Filtrar pilotos por rol
            const pilotosLider = this.pilotos.filter(piloto => piloto.rol === 'Líder');
            const pilotosEscudero = this.pilotos.filter(piloto => piloto.rol === 'Escudero');

            // Cargar pilotos líderes
            pilotosLider.forEach(piloto => {
                const option = document.createElement('option');
                option.value = piloto.id;
                option.textContent = piloto.nombre;
                selectPiloto1.appendChild(option);
            });

            // Cargar pilotos escuderos
            pilotosEscudero.forEach(piloto => {
                const option = document.createElement('option');
                option.value = piloto.id;
                option.textContent = piloto.nombre;
                selectPiloto2.appendChild(option);
            });
        }
    }

    cargarDatos() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                this.equipos = data.equipos || [];
                this.pilotos = data.pilotos || [];
                this.listarEquipos();
            })
            .catch(error => console.error('Error cargando db.json:', error));
    }

    guardarEquipo() {
        // Obtener referencias a los elementos del formulario
        const nombreInput = this.querySelector('#nombre');
        const paisInput = this.querySelector('#pais');
        const autoInput = this.querySelector('#auto');
        const imagenInput = this.querySelector('#imagen');
        const piloto1Select = this.querySelector('#piloto1');
        const piloto2Select = this.querySelector('#piloto2');

        // Verificar que todos los elementos existan
        if (!nombreInput || !paisInput || !autoInput || !imagenInput || !piloto1Select || !piloto2Select) {
            console.error('No se encontraron todos los elementos del formulario');
            return;
        }

        // Obtener valores
        const nombre = nombreInput.value.trim();
        const pais = paisInput.value.trim();
        const auto = autoInput.value.trim();
        const imagen = imagenInput.value.trim();
        const piloto1 = piloto1Select.value;
        const piloto2 = piloto2Select.value;

        // Validación
        if (!nombre || !pais || !auto || !imagen || !piloto1 || !piloto2) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Crear nuevo equipo
        const nuevoEquipo = {
            nombre,
            pais,
            auto,
            imagen,
            pilotos: [parseInt(piloto1), parseInt(piloto2)]
        };

        // Guardar en localStorage
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        equiposGuardados.push(nuevoEquipo);
        localStorage.setItem('equipos', JSON.stringify(equiposGuardados));

        // Mostrar mensaje de éxito y actualizar vista
        alert('Equipo guardado con éxito');
        this.limpiarCampos();
        this.listarEquipos();
    }

    limpiarCampos() {
        const campos = ['nombre', 'pais', 'auto', 'imagen', 'piloto1', 'piloto2'];
        campos.forEach(campo => {
            const elemento = this.querySelector(`#${campo}`);
            if (elemento) elemento.value = '';
        });
    }

    listarEquipos() {
        const container = this.querySelector('#equiposRegistrados');
        if (!container) return;
        container.innerHTML = '';

        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        let todosLosEquipos = [...this.equipos];

        equiposGuardados.forEach(equipoLocal => {
            if (!todosLosEquipos.find(e => e.nombre === equipoLocal.nombre)) {
                todosLosEquipos.push(equipoLocal);
            }
        });

        todosLosEquipos.forEach((equipo, index) => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-3');
            
            // Verificar si la imagen existe
            console.log('URL de la imagen:', equipo.imagen); // Para debugging

            const piloto1Info = this.pilotos.find(p => p.id === equipo.pilotos?.[0]);
            const piloto2Info = this.pilotos.find(p => p.id === equipo.pilotos?.[1]);

            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header p-3 text-center">
                        <img src="${equipo.imagen}" 
                             alt="${equipo.nombre}"
                             onerror="this.src='images/default-team.png'"
                             style="height: 60px; width: auto; object-fit: contain;">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-center">${equipo.nombre}</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <p class="card-text"><i class="fas fa-flag"></i> <strong>País:</strong> ${equipo.pais}</p>
                                <p class="card-text"><i class="fas fa-car"></i> <strong>Auto:</strong> ${equipo.auto || 'N/A'}</p>
                            </div>
                            <div class="col-md-6">
                                <div class="piloto-info mb-2">
                                    <i class="fas fa-user-circle"></i> <strong>Piloto 1:</strong>
                                    <div class="d-flex align-items-center">
                                        <span>${piloto1Info?.nombre || 'Sin piloto'}</span>
                                    </div>
                                </div>
                                <div class="piloto-info">
                                    <i class="fas fa-user-circle"></i> <strong>Piloto 2:</strong>
                                    <div class="d-flex align-items-center">
                                        <span>${piloto2Info?.nombre || 'Sin piloto'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    eliminarEquipo(index) {
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        equiposGuardados.splice(index, 1);
        localStorage.setItem('equipos', JSON.stringify(equiposGuardados));
        this.listarEquipos();
    }
}

customElements.define('frm-equipos', FrmEquipos);

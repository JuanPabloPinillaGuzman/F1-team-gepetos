export class FrmPilotos extends HTMLElement {
    constructor() {
        super();
        this.pilotoEditando = null;
        this.pilotos = [];  // Almacenará los pilotos cargados desde db.json
        this.render();
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h1 class="display-4 text-light mb-3">Formula 1 - Pilotos 2024</h1>
                    <div class="f1-line"></div>
                </div>
            </div>
            
            <div class="row">
                <!-- Carta para Ver Pilotos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Ver Pilotos</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Visualiza todos los pilotos actuales de la F1</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnVerPilotos">
                                    <i class="fas fa-users"></i> Ver Pilotos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carta para Registrar Pilotos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Registrar Piloto</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Registra un nuevo piloto en el sistema</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnMostrarRegistro">
                                    <i class="fas fa-user-plus"></i> Registrar Piloto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulario de Registro -->
            <div id="registroPiloto" class="mt-4" style="display: none;">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Registro de Piloto</h4>
                    </div>
                    <div class="card-body">
                        <form id="pilotoForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="nombre" class="form-label">Nombre Completo</label>
                                    <input type="text" class="form-control" id="nombre" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="equipo" class="form-label">Equipo</label>
                                    <select class="form-select" id="equipo" required>
                                        <option value="" selected>Seleccione un equipo</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="rol" class="form-label">Rol</label>
                                    <select class="form-select" id="rol" required>
                                        <option value="" selected>Seleccione un rol</option>
                                        <option value="Líder">Líder</option>
                                        <option value="Escudero">Escudero</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="imagen" class="form-label">URL de la Foto</label>
                                    <input type="url" class="form-control" id="imagen" 
                                           placeholder="https://ejemplo.com/foto.png" required>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                <button type="button" class="btn btn-primary me-2" id="guardarPiloto">
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

            <!-- Lista de Pilotos -->
            <div id="listaPilotos" class="mt-4 row" style="display: none;"></div>
        </div>
        `;

        this.cargarDatos();
        this.addEventListeners();
    }

    cargarDatos() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                this.pilotos = data.pilotos || [];
                this.equipos = data.equipos || [];
                this.cargarEquipos();
                this.listarPilotos();
            })
            .catch(error => console.error('Error cargando db.json:', error));
    }

    cargarEquipos() {
        const selectEquipo = this.querySelector('#equipo');
        selectEquipo.innerHTML = '<option value="" selected>Seleccione un equipo</option>';
        this.equipos.forEach(equipo => {
            const option = document.createElement('option');
            option.value = equipo.nombre;
            option.textContent = equipo.nombre;
            selectEquipo.appendChild(option);
        });
    }

    addEventListeners() {
        this.querySelector('#btnVerPilotos').addEventListener('click', () => this.mostrarPilotos());
        this.querySelector('#btnMostrarRegistro').addEventListener('click', () => this.mostrarRegistro());
        this.querySelector('#guardarPiloto').addEventListener('click', () => this.guardarPiloto());
        this.querySelector('#cancelarRegistro').addEventListener('click', () => this.cancelarRegistro());
    }

    mostrarPilotos() {
        const container = this.querySelector('#listaPilotos');
        container.style.display = 'flex';
        container.innerHTML = '';

        this.pilotos.forEach(piloto => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-3');
            
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header text-center">
                        <img src="${piloto.imagen}" 
                             alt="${piloto.nombre}"
                             onerror="this.src='images/default-driver.png'"
                             style="height: 100px; width: auto; object-fit: contain;">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-center">${piloto.nombre}</h5>
                        <div class="mt-3">
                            <p class="card-text">
                                <i class="fas fa-flag"></i> <strong>Equipo:</strong> ${piloto.equipo || 'Sin equipo'}
                            </p>
                            <p class="card-text">
                                <i class="fas fa-user-tag"></i> <strong>Rol:</strong> ${piloto.rol}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    mostrarRegistro() {
        this.querySelector('#registroPiloto').style.display = 'block';
        this.querySelector('#listaPilotos').style.display = 'none';
    }

    cancelarRegistro() {
        this.querySelector('#registroPiloto').style.display = 'none';
        this.querySelector('#pilotoForm').reset();
    }

    listarPilotos() {
        const container = this.querySelector('#listaPilotos');
        container.innerHTML = '';
        
        // Obtener pilotos guardados en localStorage que pueden sobrescribir los del JSON
        const pilotosGuardados = JSON.parse(localStorage.getItem('pilotos')) || [];
        
        // Combinar pilotos, dando prioridad a los guardados en localStorage
        const todosLosPilotos = this.pilotos.map(pilotoJSON => {
            const pilotoGuardado = pilotosGuardados.find(p => p.id === pilotoJSON.id);
            return pilotoGuardado || pilotoJSON;
        });

        // Agregar pilotos nuevos (sin id) del localStorage
        const pilotosNuevos = pilotosGuardados.filter(p => !p.id);
        todosLosPilotos.push(...pilotosNuevos);

        todosLosPilotos.forEach((piloto, index) => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3', 'col-md-4');
            card.innerHTML = `
                <div class="card-header p-0 text-center">
                    <img src="${piloto.imagen || 'images/default-driver.png'}" 
                         class="rounded-circle mt-3"
                         alt="${piloto.nombre}"
                         style="width: 120px; height: 120px; object-fit: cover;">
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center">${piloto.nombre}</h5>
                    <div class="piloto-info">
                        <p class="card-text"><strong>Equipo:</strong> ${piloto.equipo}</p>
                        <p class="card-text"><strong>Rol:</strong> ${piloto.rol}</p>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-warning btn-sm me-2" onclick="document.querySelector('frm-pilotos').editarPiloto(${piloto.id || 'null'}, ${index})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        ${!piloto.id ? `
                            <button class="btn btn-danger btn-sm" onclick="document.querySelector('frm-pilotos').eliminarPiloto(${index})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    guardarPiloto() {
        const nombre = this.querySelector('#nombre').value;
        const equipo = this.querySelector('#equipo').value;
        const rol = this.querySelector('#rol').value;
        const imagen = this.querySelector('#imagen').value;

        if (!nombre || !equipo || !rol || !imagen) {
            alert('Por favor, complete todos los campos');
            return;
        }

        let pilotosGuardados = JSON.parse(localStorage.getItem('pilotos')) || [];
        const nuevoPiloto = { nombre, equipo, rol, imagen };

        if (this.pilotoEditando) {
            if (this.pilotoEditando.id) {
                // Actualizar piloto existente del JSON
                nuevoPiloto.id = this.pilotoEditando.id;
                const index = pilotosGuardados.findIndex(p => p.id === this.pilotoEditando.id);
                if (index >= 0) {
                    pilotosGuardados[index] = nuevoPiloto;
                } else {
                    pilotosGuardados.push(nuevoPiloto);
                }
            } else {
                // Actualizar piloto nuevo
                pilotosGuardados[this.pilotoEditando.index] = nuevoPiloto;
            }
            this.pilotoEditando = null;
        } else {
            // Agregar nuevo piloto
            pilotosGuardados.push(nuevoPiloto);
        }

        localStorage.setItem('pilotos', JSON.stringify(pilotosGuardados));
        alert('Piloto guardado con éxito');
        this.querySelector('#pilotoForm').reset();
        this.mostrarPilotos();
    }

    editarPiloto(id, index) {
        let piloto;
        if (id) {
            // Piloto del JSON
            piloto = this.pilotos.find(p => p.id === id);
            // Verificar si hay una versión guardada en localStorage
            const pilotosGuardados = JSON.parse(localStorage.getItem('pilotos')) || [];
            const pilotoGuardado = pilotosGuardados.find(p => p.id === id);
            if (pilotoGuardado) {
                piloto = pilotoGuardado;
            }
        } else {
            // Piloto nuevo
            const pilotosGuardados = JSON.parse(localStorage.getItem('pilotos')) || [];
            piloto = pilotosGuardados[index];
        }

        if (piloto) {
            this.querySelector('#nombre').value = piloto.nombre;
            this.querySelector('#equipo').value = piloto.equipo;
            this.querySelector('#rol').value = piloto.rol;
            this.querySelector('#imagen').value = piloto.imagen;
            this.pilotoEditando = { id, index };
            this.mostrarRegistro();
        }
    }

    eliminarPiloto(index) {
        if (confirm('¿Está seguro de eliminar este piloto?')) {
            let pilotosGuardados = JSON.parse(localStorage.getItem('pilotos')) || [];
            pilotosGuardados.splice(index, 1);
            localStorage.setItem('pilotos', JSON.stringify(pilotosGuardados));
            this.listarPilotos();
        }
    }
}

customElements.define('frm-pilotos', FrmPilotos); 
export class FrmVehiculos extends HTMLElement {
    constructor() {
        super();
        this.vehiculos = [];
        this.equipos = [];
        this.vehiculoEditando = undefined;
        this.render();
        this.cargarDatos();
        this.addEventListeners();
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
            
            <div class="row">
                <!-- Carta para Ver Vehículos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Ver Vehículos</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Visualiza todos los vehículos de la F1</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnVerVehiculos">
                                    <i class="fas fa-car"></i> Ver Vehículos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carta para Registrar Vehículos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Registrar Vehículo</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Registra un nuevo vehículo en el sistema</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnMostrarRegistro">
                                    <i class="fas fa-plus-circle"></i> Registrar Vehículo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulario de Registro -->
            <div id="registroVehiculo" class="mt-4" style="display: none;">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Registro de Vehículo</h4>
                    </div>
                    <div class="card-body">
                        <form id="vehiculoForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="equipo" class="form-label">Equipo</label>
                                    <select class="form-select" id="equipo" required>
                                        <option value="">Seleccione un equipo</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="modelo" class="form-label">Modelo</label>
                                    <input type="text" class="form-control" id="modelo" required>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="motor" class="form-label">Motor</label>
                                    <select class="form-select" id="motor" required>
                                        <option value="">Seleccione un motor</option>
                                        <option value="Honda">Honda RBPT</option>
                                        <option value="Mercedes">Mercedes</option>
                                        <option value="Ferrari">Ferrari</option>
                                        <option value="Renault">Renault</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="imagen" class="form-label">URL de la Imagen</label>
                                    <input type="url" class="form-control" id="imagen" required>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="velocidadMaxima" class="form-label">Velocidad Máxima (km/h)</label>
                                    <input type="number" class="form-control" id="velocidadMaxima" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="aceleracion" class="form-label">Aceleración 0-100 (s)</label>
                                    <input type="number" class="form-control" id="aceleracion" step="0.1" required>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                <button type="button" class="btn btn-primary me-2" id="guardarVehiculo">
                                    <i class="fas fa-save"></i> Guardar
                                </button>
                                <button type="button" class="btn btn-secondary" id="cancelarRegistro">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="row" id="vehiculosContainer" style="display: none;"></div>
        </div>
        `;
    }

    addEventListeners() {
        this.querySelector('#btnVerVehiculos').addEventListener('click', () => this.mostrarVehiculos());
        this.querySelector('#btnMostrarRegistro').addEventListener('click', () => this.mostrarRegistro());
        this.querySelector('#guardarVehiculo').addEventListener('click', () => this.guardarVehiculo());
        this.querySelector('#cancelarRegistro').addEventListener('click', () => this.cancelarRegistro());
    }

    cargarDatos() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                this.vehiculos = data.vehiculos;
                this.equipos = data.equipos;
                this.cargarEquipos();
            })
            .catch(error => console.error('Error cargando datos:', error));
    }

    cargarEquipos() {
        const selectEquipo = this.querySelector('#equipo');
        selectEquipo.innerHTML = '<option value="">Seleccione un equipo</option>';
        this.equipos.forEach(equipo => {
            const option = document.createElement('option');
            option.value = equipo.nombre;
            option.textContent = equipo.nombre;
            selectEquipo.appendChild(option);
        });
    }

    mostrarRegistro() {
        this.querySelector('#registroVehiculo').style.display = 'block';
        this.querySelector('#vehiculosContainer').style.display = 'none';
    }

    cancelarRegistro() {
        this.querySelector('#registroVehiculo').style.display = 'none';
        this.querySelector('#vehiculosContainer').style.display = 'flex';
        this.querySelector('#vehiculoForm').reset();
    }

    guardarVehiculo() {
        const formData = {
            equipo: this.querySelector('#equipo').value,
            modelo: this.querySelector('#modelo').value,
            motor: this.querySelector('#motor').value,
            imagen: this.querySelector('#imagen').value,
            especificaciones: {
                velocidad_maxima_kmh: parseInt(this.querySelector('#velocidadMaxima').value),
                aceleracion_0_100: parseFloat(this.querySelector('#aceleracion').value)
            }
        };

        if (!this.validarFormulario(formData)) {
            alert('Por favor, complete todos los campos requeridos');
            return;
        }

        let vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];

        if (this.vehiculoEditando !== undefined) {
            // Si es un vehículo del JSON, agregarlo como nuevo en localStorage
            if (this.vehiculoEditando < this.vehiculos.length) {
                vehiculosGuardados.push(formData);
            } else {
                // Si es un vehículo de localStorage, actualizarlo
                const indexLocal = this.vehiculoEditando - this.vehiculos.length;
                vehiculosGuardados[indexLocal] = formData;
            }
            
            this.vehiculoEditando = undefined;
            const btnGuardar = this.querySelector('#guardarVehiculo');
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
        } else {
            // Agregar nuevo vehículo
            vehiculosGuardados.push(formData);
        }

        localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
        alert('Vehículo guardado con éxito');
        this.cancelarRegistro();
        this.mostrarVehiculos();
    }

    validarFormulario(data) {
        return data.equipo && data.modelo && data.motor && data.imagen &&
               data.especificaciones.velocidad_maxima_kmh && data.especificaciones.aceleracion_0_100;
    }

    mostrarVehiculos() {
        const container = this.querySelector('#vehiculosContainer');
        container.style.display = 'flex';
        container.innerHTML = '';
        
        const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
        
        // Combinar vehículos, excluyendo los eliminados
        const todosLosVehiculos = this.vehiculos.map(vehiculoJSON => {
            const vehiculoGuardado = vehiculosGuardados.find(v => 
                v.modelo === vehiculoJSON.modelo && v.equipo === vehiculoJSON.equipo
            );
            // Si el vehículo está marcado como eliminado, no lo incluimos
            if (vehiculoGuardado && vehiculoGuardado.eliminado) {
                return null;
            }
            return vehiculoGuardado || vehiculoJSON;
        }).filter(v => v !== null); // Eliminar los null del array

        // Agregar vehículos nuevos del localStorage (que no estén eliminados)
        const vehiculosNuevos = vehiculosGuardados.filter(v => 
            !v.eliminado && 
            !this.vehiculos.some(vj => vj.modelo === v.modelo && vj.equipo === v.equipo)
        );
        todosLosVehiculos.push(...vehiculosNuevos);

        // Resto del código de mostrarVehiculos igual...
        todosLosVehiculos.forEach((vehiculo, index) => {
            const card = document.createElement('div');
            card.classList.add('col-md-6', 'mb-4');
            card.innerHTML = /*html*/ `
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${vehiculo.equipo} - ${vehiculo.modelo}</h5>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-primary editar-vehiculo" data-index="${index}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger eliminar-vehiculo" data-index="${index}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Agregar event listeners para los botones
            const btnEditar = card.querySelector('.editar-vehiculo');
            const btnEliminar = card.querySelector('.eliminar-vehiculo');
            
            btnEditar.addEventListener('click', () => this.editarVehiculo(index));
            btnEliminar.addEventListener('click', () => this.eliminarVehiculo(index));
            
            container.appendChild(card);
        });

        this.querySelector('#registroVehiculo').style.display = 'none';
    }

    editarVehiculo(index) {
        const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
        const todosLosVehiculos = [...this.vehiculos, ...vehiculosGuardados];
        const vehiculo = todosLosVehiculos[index];

        if (vehiculo) {
            // Llenar el formulario con los datos del vehículo
            this.querySelector('#equipo').value = vehiculo.equipo;
            this.querySelector('#modelo').value = vehiculo.modelo;
            this.querySelector('#motor').value = vehiculo.motor;
            this.querySelector('#imagen').value = vehiculo.imagen;
            this.querySelector('#velocidadMaxima').value = vehiculo.especificaciones.velocidad_maxima_kmh;
            this.querySelector('#aceleracion').value = vehiculo.especificaciones.aceleracion_0_100;

            // Guardar el índice del vehículo que se está editando
            this.vehiculoEditando = index;

            // Mostrar el formulario
            this.mostrarRegistro();

            // Cambiar el texto del botón guardar
            const btnGuardar = this.querySelector('#guardarVehiculo');
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        }
    }

    eliminarVehiculo(index) {
        if (confirm('¿Está seguro de eliminar este vehículo?')) {
            let vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
            
            if (index < this.vehiculos.length) {
                // Es un vehículo del JSON original
                const vehiculoOriginal = this.vehiculos[index];
                // Marcar el vehículo como eliminado en localStorage
                const vehiculoEliminado = {
                    ...vehiculoOriginal,
                    eliminado: true
                };
                vehiculosGuardados.push(vehiculoEliminado);
            } else {
                // Es un vehículo nuevo, eliminarlo directamente
                const indexLocal = index - this.vehiculos.length;
                vehiculosGuardados.splice(indexLocal, 1);
            }
            
            localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
            this.mostrarVehiculos();
        }
    }
}

customElements.define('frm-vehiculos', FrmVehiculos); 
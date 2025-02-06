export class FrmCircuitos extends HTMLElement {
    constructor() {
        super();
        this.circuitos = [];
        this.circuitoEditando = null;
        this.render();
        this.cargarDatos();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = /*html*/ `
        <style>
            .card {
                color: #333; /* Color oscuro para el texto dentro de las cards */
            }
            .display-4 {
                color: #ffffff; /* Mantener el título principal en blanco */
            }
        </style>
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h1 class="display-4 mb-3">Formula 1 - Circuitos 2024</h1>
                    <div class="f1-line"></div>
                </div>
            </div>
            
            <div class="row">
                <!-- Carta para Ver Circuitos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Ver Circuitos</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Explora todos los circuitos de la temporada 2024</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnVerCircuitos">
                                    <i class="fas fa-road"></i> Ver Circuitos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carta para Registrar Circuitos -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Registrar Circuito</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">Añade un nuevo circuito al calendario</p>
                            <div class="text-center">
                                <button class="btn btn-primary" id="btnMostrarRegistro">
                                    <i class="fas fa-plus-circle"></i> Registrar Circuito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Circuitos -->
            <div id="circuitosRegistrados" class="row mt-4" style="display: none;"></div>

            <!-- Formulario de Registro -->
            <div id="registroCircuito" class="mt-4" style="display: none;">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Registro de Nuevo Circuito</h4>
                    </div>
                    <div class="card-body">
                        <form id="circuitoForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="nombre" class="form-label">Nombre del Circuito</label>
                                    <input type="text" class="form-control" id="nombre" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="pais" class="form-label">País</label>
                                    <input type="text" class="form-control" id="pais" required>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="longitud" class="form-label">Longitud (km)</label>
                                    <input type="number" step="0.001" class="form-control" id="longitud" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="curvas" class="form-label">Número de Curvas</label>
                                    <input type="number" class="form-control" id="curvas" required>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-12">
                                    <label for="descripcion" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="descripcion" rows="3" required></textarea>
                                </div>
                            </div>

                            <div class="row g-3 mt-2">
                                <div class="col-md-6">
                                    <label for="imagen" class="form-label">URL de la Imagen</label>
                                    <input type="url" class="form-control" id="imagen" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="fecha" class="form-label">Fecha del GP</label>
                                    <input type="date" class="form-control" id="fecha" required>
                                </div>
                            </div>

                            <div class="text-center mt-4">
                                <button type="button" class="btn btn-primary me-2" id="guardarCircuito">
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
        </div>
        `;
    }

    cargarDatos() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                this.circuitos = data.circuitos.map(circuito => ({
                    ...circuito,
                    longitud: circuito.longitud_km || circuito.longitud,
                    curvas: circuito.numero_curvas || {
                        'Circuito de Mónaco': 19,
                        'Silverstone': 18,
                        'Circuito de Spa-Francorchamps': 19,
                        'Circuito de Monza': 11,
                        'Interlagos': 15,
                        'Circuito de Yas Marina': 16
                    }[circuito.nombre] || 15, // valor por defecto si no está en la lista
                    descripcion: circuito.descripcion || 
                        `Circuito ${circuito.nombre} ubicado en ${circuito.pais}`,
                    fecha: circuito.fecha || '2024-03-01'
                }));
                this.mostrarCircuitos();
            })
            .catch(error => console.error('Error:', error));
    }

    addEventListeners() {
        this.querySelector('#btnVerCircuitos').addEventListener('click', () => this.mostrarCircuitos());
        this.querySelector('#btnMostrarRegistro').addEventListener('click', () => this.mostrarRegistro());
        this.querySelector('#guardarCircuito').addEventListener('click', () => this.guardarCircuito());
        this.querySelector('#cancelarRegistro').addEventListener('click', () => this.cancelarRegistro());
    }

    mostrarCircuitos() {
        const container = this.querySelector('#circuitosRegistrados');
        container.style.display = 'flex';
        container.innerHTML = '';
        
        const circuitosGuardados = JSON.parse(localStorage.getItem('circuitos')) || [];
        
        const todosLosCircuitos = this.circuitos.map(circuitoJSON => {
            const circuitoGuardado = circuitosGuardados.find(c => 
                c.nombre === circuitoJSON.nombre && c.pais === circuitoJSON.pais
            );
            return circuitoGuardado || circuitoJSON;
        });

        todosLosCircuitos.forEach((circuito, index) => {
            const card = document.createElement('div');
            card.classList.add('col-md-6', 'mb-4');
            
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${circuito.nombre}</h5>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-primary editar-circuito" data-index="${index}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger eliminar-circuito" data-index="${index}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${circuito.imagen}" 
                                     class="img-fluid mb-3 circuit-image" 
                                     alt="${circuito.nombre}"
                                     onerror="this.src='images/default-circuit.png'"
                                     style="width: 100%; height: auto;">
                            </div>
                            <div class="col-md-8">
                                <p><strong>País:</strong> ${circuito.pais}</p>
                                <p><strong>Longitud:</strong> ${circuito.longitud_km || circuito.longitud} km</p>
                                <p><strong>Vueltas:</strong> ${circuito.vueltas || 'N/A'}</p>
                                <p class="mt-2">${circuito.descripcion}</p>
                                ${circuito.record_vuelta ? `
                                    <div class="mt-3 p-2 bg-light rounded">
                                        <h6 class="mb-2"><i class="fas fa-stopwatch"></i> Récord de Vuelta</h6>
                                        <p class="mb-1"><strong>Tiempo:</strong> ${circuito.record_vuelta.tiempo}</p>
                                        <p class="mb-1"><strong>Piloto:</strong> ${circuito.record_vuelta.piloto}</p>
                                        <p class="mb-0"><strong>Año:</strong> ${circuito.record_vuelta.año}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const btnEditar = card.querySelector('.editar-circuito');
            const btnEliminar = card.querySelector('.eliminar-circuito');
            
            btnEditar.addEventListener('click', () => this.editarCircuito(index));
            btnEliminar.addEventListener('click', () => this.eliminarCircuito(index));
            
            container.appendChild(card);
        });

        this.querySelector('#registroCircuito').style.display = 'none';
    }

    editarCircuito(index) {
        const circuitosGuardados = JSON.parse(localStorage.getItem('circuitos')) || [];
        let circuito;

        if (index < this.circuitos.length) {
            // Es un circuito del JSON original
            circuito = this.circuitos[index];
            // Verificar si hay una versión actualizada en localStorage
            const circuitoActualizado = circuitosGuardados.find(c => 
                c.nombre === circuito.nombre && c.pais === circuito.pais
            );
            if (circuitoActualizado) {
                circuito = circuitoActualizado;
            }
        } else {
            // Es un circuito nuevo de localStorage
            const indexLocal = index - this.circuitos.length;
            circuito = circuitosGuardados[indexLocal];
        }

        if (circuito) {
            this.querySelector('#nombre').value = circuito.nombre;
            this.querySelector('#pais').value = circuito.pais;
            this.querySelector('#longitud').value = circuito.longitud;
            this.querySelector('#curvas').value = circuito.curvas;
            this.querySelector('#descripcion').value = circuito.descripcion;
            this.querySelector('#imagen').value = circuito.imagen;
            this.querySelector('#fecha').value = circuito.fecha;

            this.circuitoEditando = index;
            this.mostrarRegistro();

            const btnGuardar = this.querySelector('#guardarCircuito');
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        }
    }

    eliminarCircuito(index) {
        if (confirm('¿Está seguro de eliminar este circuito?')) {
            let circuitosGuardados = JSON.parse(localStorage.getItem('circuitos')) || [];
            
            if (index < this.circuitos.length) {
                // Si es un circuito del JSON original, lo marcamos como eliminado en localStorage
                const circuitoEliminado = this.circuitos[index];
                circuitosGuardados = circuitosGuardados.filter(c => 
                    c.nombre !== circuitoEliminado.nombre && c.pais !== circuitoEliminado.pais
                );
            } else {
                // Si es un circuito nuevo, lo eliminamos directamente
                const indexLocal = index - this.circuitos.length;
                circuitosGuardados.splice(indexLocal, 1);
            }
            
            localStorage.setItem('circuitos', JSON.stringify(circuitosGuardados));
            this.mostrarCircuitos();
        }
    }

    mostrarRegistro() {
        this.querySelector('#registroCircuito').style.display = 'block';
        this.querySelector('#circuitosRegistrados').style.display = 'none';
    }

    cancelarRegistro() {
        this.querySelector('#registroCircuito').style.display = 'none';
        this.querySelector('#circuitoForm').reset();
        this.circuitoEditando = null;
        const btnGuardar = this.querySelector('#guardarCircuito');
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }

    guardarCircuito() {
        const formData = {
            nombre: this.querySelector('#nombre').value,
            pais: this.querySelector('#pais').value,
            longitud: parseFloat(this.querySelector('#longitud').value),
            curvas: parseInt(this.querySelector('#curvas').value),
            descripcion: this.querySelector('#descripcion').value,
            imagen: this.querySelector('#imagen').value,
            fecha: this.querySelector('#fecha').value
        };

        if (!this.validarFormulario(formData)) {
            alert('Por favor, complete todos los campos correctamente');
            return;
        }

        let circuitosGuardados = JSON.parse(localStorage.getItem('circuitos')) || [];

        if (this.circuitoEditando !== null) {
            if (this.circuitoEditando < this.circuitos.length) {
                // Si estamos editando un circuito del JSON original
                const circuitoOriginal = this.circuitos[this.circuitoEditando];
                // Eliminar cualquier versión anterior
                circuitosGuardados = circuitosGuardados.filter(c => 
                    !(c.nombre === circuitoOriginal.nombre && c.pais === circuitoOriginal.pais)
                );
                // Agregar la versión actualizada
                circuitosGuardados.push(formData);
            } else {
                // Si estamos editando un circuito nuevo
                const indexLocal = this.circuitoEditando - this.circuitos.length;
                circuitosGuardados[indexLocal] = formData;
            }
            
            this.circuitoEditando = null;
            const btnGuardar = this.querySelector('#guardarCircuito');
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
        } else {
            // Verificar si ya existe un circuito con el mismo nombre y país
            const circuitoExistente = circuitosGuardados.findIndex(c => 
                c.nombre === formData.nombre && c.pais === formData.pais
            );

            if (circuitoExistente !== -1) {
                // Actualizar el existente
                circuitosGuardados[circuitoExistente] = formData;
            } else {
                // Agregar nuevo
                circuitosGuardados.push(formData);
            }
        }

        localStorage.setItem('circuitos', JSON.stringify(circuitosGuardados));
        alert('Circuito guardado con éxito');
        this.querySelector('#circuitoForm').reset();
        this.mostrarCircuitos();
    }

    validarFormulario(data) {
        return data.nombre && data.pais && data.longitud > 0 && data.curvas > 0 &&
               data.descripcion && data.imagen && data.fecha;
    }
}

customElements.define('frm-circuitos', FrmCircuitos); 
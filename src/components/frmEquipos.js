import { equipos } from '../../db/dataTeams.js';  // Importa los equipos disponibles
import { pilotos } from '../../db/datapilots.js'; 
// Importa los pilotos disponibles

// Define la clase FrmEquipos que extiende HTMLElement
export class FrmEquipos extends HTMLElement {
    constructor() {
        super();  // Llama al constructor del HTMLElement
        this.equipoEditando = null;  // Indica si estamos editando un equipo
        this.render();  // Llama al método render para dibujar la interfaz
    }

    // Método para renderizar la interfaz de usuario
    render() {
        this.innerHTML = /*html*/ `
        <!-- Sección de botones para registrar y mostrar equipos -->
        <div class="text-center mt-3" >
            <button class="btn btn-primary" id="btnRegistrar">Registrar Equipo</button>
            <button class="btn btn-secondary" id="btnMostrar">Mostrar Equipos Registrados</button>
        </div>

        <!-- Formulario para registrar un equipo (inicialmente oculto) -->
        <div id="registroEquipo" class="mt-3" style="display: none;">
            <div class="card">
                <div class="card-header">Registro de equipos F1</div>
                <div class="card-body">
                    <form id="equipoForm">
                        <div class="row g-3">
                            <!-- Campo para seleccionar el nombre del equipo -->
                            <div class="col-md-4">
                                <label for="nombre" class="form-label">Equipo</label>
                                <select class="form-select" id="nombre"></select>
                            </div>
                            <!-- Campo para mostrar el país del equipo (solo lectura) -->
                            <div class="col-md-4">
                                <label for="pais" class="form-label">País</label>
                                <input type="text" class="form-control" id="pais" readonly>
                            </div>
                            <!-- Campo para mostrar el motor del equipo (solo lectura) -->
                            <div class="col-md-4">
                                <label for="motor" class="form-label">Motor</label>
                                <input type="text" class="form-control" id="motor" readonly>
                            </div>
                        </div>

                        <!-- Campos para seleccionar los pilotos -->
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

                        <!-- Botón para guardar el equipo -->
                        <div class="mt-3">
                            <button type="button" class="btn btn-primary" id="guardarEquipo">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Sección para mostrar los equipos registrados (inicialmente oculta) -->
        <div id="equiposRegistrados" class="mt-3 row" style="display: none;"></div>
        `;

        this.cargarEquipos();  // Llama a la función para cargar los equipos en el selector
        this.cargarPilotos();  // Llama a la función para cargar los pilotos en los selectores
        this.addEventListeners();  // Añade los eventos a los botones y formularios
        this.listarEquipos();  // Muestra los equipos registrados en el contenedor
    }

    // Método para cargar los equipos en el selector
    cargarEquipos() {
        const selectEquipo = this.querySelector('#nombre');
        selectEquipo.innerHTML = '<option value="" selected>Seleccione un equipo</option>';  // Opción por defecto
        equipos.forEach(e => {
            const option = document.createElement('option');
            option.value = e.nombre;
            option.textContent = e.nombre;
            selectEquipo.appendChild(option);  // Añade cada equipo como opción en el select
        });
    }

    // Método para cargar los pilotos en los selectores de piloto1 y piloto2
    cargarPilotos() {
        const piloto1Select = this.querySelector('#piloto1');
        const piloto2Select = this.querySelector('#piloto2');
        
        piloto1Select.innerHTML = '<option value="" selected>Seleccione un piloto líder</option>';
        piloto2Select.innerHTML = '<option value="" selected>Seleccione un piloto escudero</option>';
        
        pilotos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = p.nombre;
            // Añade el piloto como líder o escudero según corresponda
            if (p.rol === "Líder") {
                piloto1Select.appendChild(option);
            } else {
                piloto2Select.appendChild(option);
            }
        });
    }

    // Método para agregar los event listeners a los botones y campos
    addEventListeners() {
        this.querySelector('#btnRegistrar').addEventListener('click', () => this.mostrarRegistro());  // Muestra el formulario de registro
        this.querySelector('#btnMostrar').addEventListener('click', () => this.mostrarEquiposRegistrados());  // Muestra los equipos registrados
        this.querySelector('#guardarEquipo').addEventListener('click', (e) => this.guardarEquipo(e));  // Guarda un nuevo equipo
        this.querySelector('#nombre').addEventListener('change', () => this.actualizarDatosEquipo());
          // Actualiza los datos del equipo seleccionado
    }

    // Método que actualiza los campos de país y motor cuando se selecciona un equipo
    actualizarDatosEquipo() {
        const equipoSeleccionado = this.querySelector('#nombre').value;
        const equipo = equipos.find(e => e.nombre === equipoSeleccionado);
        if (equipo) {
            this.querySelector('#pais').value = equipo.pais;  // Actualiza el país
            this.querySelector('#motor').value = equipo.motor;  // Actualiza el motor
        } else {
            this.querySelector('#pais').value = '';  // Si no hay equipo seleccionado, limpia los campos
            this.querySelector('#motor').value = '';
        }
    }

    // Muestra el formulario de registro y oculta la lista de equipos registrados
    mostrarRegistro() {
        document.querySelector('#registroEquipo').style.display = 'block';
        document.querySelector('#equiposRegistrados').style.display = 'none';
    }



    // Muestra los equipos registrados y oculta el formulario de registro
    mostrarEquiposRegistrados() {
        document.querySelector('#registroEquipo').style.display = 'none';
        document.querySelector('#equiposRegistrados').style.display = 'block';
        this.listarEquipos();  // Lista los equipos registrados
    }

    // Método para guardar un equipo en localStorage
    guardarEquipo(e) {
        e.preventDefault();
        const nombre = this.querySelector('#nombre').value;
        const pais = this.querySelector('#pais').value;
        const motor = this.querySelector('#motor').value;
        const piloto1 = this.querySelector('#piloto1').value;
        const piloto2 = this.querySelector('#piloto2').value;

        // Obtiene los equipos guardados desde localStorage o crea un array vacío
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        if (this.equipoEditando !== null) {
            // Si estamos editando un equipo, lo actualiza
            equiposGuardados[this.equipoEditando] = { nombre, pais, motor, piloto1, piloto2 };
            this.equipoEditando = null;
        } else {
            // Si no estamos editando, agrega un nuevo equipo
            equiposGuardados.push({ nombre, pais, motor, piloto1, piloto2 });
        }
        
        // Guarda los equipos actualizados en localStorage
        localStorage.setItem('equipos', JSON.stringify(equiposGuardados));
        alert('Equipo guardado con éxito');  // Muestra un mensaje de éxito
        this.listarEquipos();  // Actualiza la lista de equipos
    }

    // Método para editar un equipo
    editarEquipo(index) {
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        let equipo = equiposGuardados[index];
        if (equipo) {
            // Prellena los campos del formulario con los datos del equipo seleccionado
            this.querySelector('#nombre').value = equipo.nombre;
            this.querySelector('#pais').value = equipo.pais;
            this.querySelector('#motor').value = equipo.motor;
            this.querySelector('#piloto1').value = equipo.piloto1;
            this.querySelector('#piloto2').value = equipo.piloto2;
            this.equipoEditando = index;  // Guarda el índice del equipo que se está editando
            this.mostrarRegistro();  // Muestra el formulario de registro
        }
    }

    // Método para listar los equipos guardados
    listarEquipos() {
        const container = this.querySelector('#equiposRegistrados');
        container.innerHTML = '';  // Limpia la lista antes de mostrarla
        const equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];

        equiposGuardados.forEach((equipo, index) => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3', 'col-md-3');
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${equipo.nombre}</h5>
                    <p class="card-text"><strong>País:</strong> ${equipo.pais}</p>
                    <p class="card-text"><strong>Motor:</strong> ${equipo.motor}</p>
                    <p class="card-text"><strong>Piloto 1 (Líder):</strong> ${equipo.piloto1}</p>
                    <p class="card-text"><strong>Piloto 2 (Escudero):</strong> ${equipo.piloto2}</p>
                    <!-- Botones para eliminar o editar el equipo -->
                    <button class="btn btn-danger btn-sm" onclick="document.querySelector('frm-equipos').eliminarEquipo(${index})">Eliminar</button>
                    <button class="btn btn-warning btn-sm" onclick="document.querySelector('frm-equipos').editarEquipo(${index})">Editar</button>
                </div>
            `;
            container.appendChild(card);  // Añade cada equipo como una tarjeta
        });
    }

    // Método para eliminar un equipo
    eliminarEquipo(index) {
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        equiposGuardados.splice(index, 1);  // Elimina el equipo en el índice dado
        localStorage.setItem('equipos', JSON.stringify(equiposGuardados));  // Guarda los cambios en localStorage
        this.listarEquipos();  // Actualiza la lista de equipos
    }
}

// Define el componente personalizado 'frm-equipos'
customElements.define('frm-equipos', FrmEquipos);

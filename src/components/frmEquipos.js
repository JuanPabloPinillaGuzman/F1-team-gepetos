export class FrmEquipos extends HTMLElement {
    constructor() {
        super();
        this.equipoEditando = null;
        this.equipos = [];  // Almacenará los equipos cargados desde db.json
        this.pilotos = [];  // Almacenará los pilotos cargados desde db.json
        this.render();
    }

    // Método para renderizar la interfaz de usuario
    render() {
        this.innerHTML = /*html*/ `
        <div class="text-center mt-3" >
            <button class="btn btn-primary" id="btnRegistrar">Registrar Equipo</button>
            <button class="btn btn-secondary" id="btnMostrar">Mostrar Equipos Registrados</button>
        </div>

        <div id="registroEquipo" class="mt-3" style="display: none;">
            <div class="card">
                <div class="card-header">Registro de equipos F1</div>
                <div class="card-body">
                    <form id="equipoForm">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="nombre" class="form-label">Equipo</label>
                                <select class="form-select" id="nombre"></select>
                            </div>
                            <div class="col-md-4">
                                <label for="pais" class="form-label">País</label>
                                <input type="text" class="form-control" id="pais" readonly>
                            </div>
                            <div class="col-md-4">
                                <label for="motor" class="form-label">Motor</label>
                                <input type="text" class="form-control" id="motor" readonly>
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

                        <div class="mt-3">
                            <button type="button" class="btn btn-primary" id="guardarEquipo">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="equiposRegistrados" class="mt-3 row" style="display: none;"></div>
        `;

        this.cargarDatos();  // Cargar datos desde db.json
        this.addEventListeners();
    }

    // Método para cargar los datos desde db.json
    cargarDatos() {
        // Simulamos un fetch para obtener los datos de db.json (ajustar la URL si es necesario)
        fetch('./src/db.json') // Asegúrate de poner la ruta correcta al archivo db.json
            .then(response => response.json())
            .then(data => {
                this.equipos = data.equipos || [];  // Asumiendo que el JSON tiene una clave 'equipos'
                this.pilotos = data.pilotos || [];  // Asumiendo que el JSON tiene una clave 'pilotos'
                this.cargarEquipos();  // Llama a cargar los equipos en el select
                this.cargarPilotos();  // Llama a cargar los pilotos en el formulario
                this.listarEquipos();  // Muestra los equipos guardados
            })
            .catch(error => console.error('Error cargando db.json:', error));
    }

    cargarEquipos() {
        const selectEquipo = this.querySelector('#nombre');
        selectEquipo.innerHTML = '<option value="" selected>Seleccione un equipo</option>';
        this.equipos.forEach(e => {
            const option = document.createElement('option');
            option.value = e.nombre;
            option.textContent = e.nombre;
            selectEquipo.appendChild(option);
        });
    }

    cargarPilotos() {
        const piloto1Select = this.querySelector('#piloto1');
        const piloto2Select = this.querySelector('#piloto2');

        piloto1Select.innerHTML = '<option value="" selected>Seleccione un piloto líder</option>';
        piloto2Select.innerHTML = '<option value="" selected>Seleccione un piloto escudero</option>';

        this.pilotos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = p.nombre;
            if (p.rol === "Líder") {
                piloto1Select.appendChild(option);
            } else {
                piloto2Select.appendChild(option);
            }
        });
    }

    addEventListeners() {
        this.querySelector('#btnRegistrar').addEventListener('click', () => this.mostrarRegistro());
        this.querySelector('#btnMostrar').addEventListener('click', () => this.mostrarEquiposRegistrados());
        this.querySelector('#guardarEquipo').addEventListener('click', (e) => this.guardarEquipo(e));
        this.querySelector('#nombre').addEventListener('change', () => this.actualizarDatosEquipo());
    }

    actualizarDatosEquipo() {
        const equipoSeleccionado = this.querySelector('#nombre').value;
        const equipo = this.equipos.find(e => e.nombre === equipoSeleccionado);
        if (equipo) {
            this.querySelector('#pais').value = equipo.pais;
            this.querySelector('#motor').value = equipo.motor;
        } else {
            this.querySelector('#pais').value = '';
            this.querySelector('#motor').value = '';
        }
    }

    mostrarRegistro() {
        document.querySelector('#registroEquipo').style.display = 'block';
        document.querySelector('#equiposRegistrados').style.display = 'none';
    }

    mostrarEquiposRegistrados() {
        document.querySelector('#registroEquipo').style.display = 'none';
        document.querySelector('#equiposRegistrados').style.display = 'block';
        this.listarEquipos();
    }

    guardarEquipo(e) {
        e.preventDefault();
        const nombre = this.querySelector('#nombre').value;
        const pais = this.querySelector('#pais').value;
        const motor = this.querySelector('#motor').value;
        const piloto1 = this.querySelector('#piloto1').value;
        const piloto2 = this.querySelector('#piloto2').value;

        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        if (this.equipoEditando !== null) {
            equiposGuardados[this.equipoEditando] = { nombre, pais, motor, piloto1, piloto2 };
            this.equipoEditando = null;
        } else {
            equiposGuardados.push({ nombre, pais, motor, piloto1, piloto2 });
        }

        localStorage.setItem('equipos', JSON.stringify(equiposGuardados));
        alert('Equipo guardado con éxito');
        this.listarEquipos();
    }

    editarEquipo(index) {
        let equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
        let equipo = equiposGuardados[index];
        if (equipo) {
            this.querySelector('#nombre').value = equipo.nombre;
            this.querySelector('#pais').value = equipo.pais;
            this.querySelector('#motor').value = equipo.motor;
            this.querySelector('#piloto1').value = equipo.piloto1;
            this.querySelector('#piloto2').value = equipo.piloto2;
            this.equipoEditando = index;
            this.mostrarRegistro();
        }
    }

    listarEquipos() {
        const container = this.querySelector('#equiposRegistrados');
        container.innerHTML = '';
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
                    <button class="btn btn-danger btn-sm" onclick="document.querySelector('frm-equipos').eliminarEquipo(${index})">Eliminar</button>
                    <button class="btn btn-warning btn-sm" onclick="document.querySelector('frm-equipos').editarEquipo(${index})">Editar</button>
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

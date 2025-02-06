export class FrmSimulacion extends HTMLElement {
    constructor() {
        super();
        this.vehiculos = [];
        this.circuitos = [];
        this.pilotos = [];
        this.render();
        this.cargarDatos();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = /*html*/ `
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h1 class="display-4 text-light mb-3">Formula 1 - Simulación de Carrera</h1>
                    <div class="f1-line"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0">Configuración de la Carrera</h4>
                </div>
                <div class="card-body">
                    <form id="simulacionForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="circuito" class="form-label">Circuito</label>
                                <select class="form-select" id="circuito" required>
                                    <option value="">Seleccione un circuito</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="vueltas" class="form-label">Número de Vueltas</label>
                                <input type="number" class="form-control" id="vueltas" min="1" max="50" value="10" required>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-12">
                                <h5>Participantes</h5>
                                <div id="participantes" class="row g-3">
                                    <!-- Se llenará dinámicamente -->
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <button type="button" class="btn btn-primary" id="btnSimular">
                                <i class="fas fa-flag-checkered"></i> Iniciar Simulación
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Resultados de la Simulación -->
            <div id="resultadosSimulacion" class="mt-4" style="display: none;">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Resultados de la Carrera</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Posición</th>
                                        <th>Piloto</th>
                                        <th>Equipo</th>
                                        <th>Tiempo Total</th>
                                        <th>Mejor Vuelta</th>
                                        <th>Paradas Box</th>
                                    </tr>
                                </thead>
                                <tbody id="resultadosTabla">
                                </tbody>
                            </table>
                        </div>
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
                this.vehiculos = data.vehiculos || [];
                this.circuitos = data.circuitos || [];
                this.pilotos = data.pilotos || [];
                this.cargarCircuitos();
                this.cargarParticipantes();
            })
            .catch(error => console.error('Error cargando datos:', error));
    }

    cargarCircuitos() {
        const select = this.querySelector('#circuito');
        this.circuitos.forEach(circuito => {
            const option = document.createElement('option');
            option.value = circuito.nombre;
            option.textContent = `${circuito.nombre} - ${circuito.pais}`;
            select.appendChild(option);
        });
    }

    cargarParticipantes() {
        const container = this.querySelector('#participantes');
        this.pilotos.forEach((piloto, index) => {
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-3');
            
            const vehiculo = this.vehiculos.find(v => v.equipo === piloto.equipo);
            
            col.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${index}" 
                                   id="piloto${index}" name="participantes">
                            <label class="form-check-label" for="piloto${index}">
                                ${piloto.nombre} - ${piloto.equipo}
                                <br>
                                <small class="text-muted">Vehículo: ${vehiculo ? vehiculo.modelo : 'N/A'}</small>
                            </label>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }

    addEventListeners() {
        this.querySelector('#btnSimular').addEventListener('click', () => this.simularCarrera());
    }

    simularCarrera() {
        const circuitoNombre = this.querySelector('#circuito').value;
        const vueltas = parseInt(this.querySelector('#vueltas').value);
        const participantesSeleccionados = Array.from(this.querySelectorAll('input[name="participantes"]:checked'))
            .map(input => parseInt(input.value));

        if (!circuitoNombre || vueltas <= 0 || participantesSeleccionados.length < 2) {
            alert('Por favor, seleccione un circuito y al menos 2 participantes');
            return;
        }

        const resultados = this.realizarSimulacion(circuitoNombre, vueltas, participantesSeleccionados);
        this.mostrarResultados(resultados);
    }

    realizarSimulacion(circuitoNombre, vueltas, participantes) {
        const circuito = this.circuitos.find(c => c.nombre === circuitoNombre);
        const resultados = [];

        participantes.forEach(pilotoIndex => {
            const piloto = this.pilotos[pilotoIndex];
            const vehiculo = this.vehiculos.find(v => v.equipo === piloto.equipo);
            
            // Simulación básica para cada piloto
            const tiempoBase = Math.random() * 10 + 80; // Tiempo base entre 80-90 segundos
            const variacionPorVuelta = Math.random() * 2 - 1; // Variación de ±1 segundo
            const paradasBox = Math.floor(Math.random() * 3); // 0-2 paradas
            const mejorVuelta = tiempoBase - Math.random() * 2; // Mejor vuelta ligeramente mejor que el tiempo base
            
            const tiempoTotal = (tiempoBase * vueltas) + (variacionPorVuelta * vueltas) + (paradasBox * 25);
            
            resultados.push({
                piloto: piloto.nombre,
                equipo: piloto.equipo,
                tiempoTotal,
                mejorVuelta,
                paradasBox,
                vehiculo: vehiculo ? vehiculo.modelo : 'N/A'
            });
        });

        // Ordenar por tiempo total
        return resultados.sort((a, b) => a.tiempoTotal - b.tiempoTotal);
    }

    mostrarResultados(resultados) {
        const container = this.querySelector('#resultadosSimulacion');
        const tabla = this.querySelector('#resultadosTabla');
        container.style.display = 'block';
        tabla.innerHTML = '';

        resultados.forEach((resultado, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}º</td>
                <td>${resultado.piloto}</td>
                <td>${resultado.equipo} - ${resultado.vehiculo}</td>
                <td>${this.formatTiempo(resultado.tiempoTotal)}</td>
                <td>${this.formatTiempo(resultado.mejorVuelta)}</td>
                <td>${resultado.paradasBox}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    formatTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = (segundos % 60).toFixed(3);
        return `${minutos}:${segs.padStart(6, '0')}`;
    }
}

customElements.define('frm-simulacion', FrmSimulacion); 
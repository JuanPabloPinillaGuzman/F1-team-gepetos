import { MainMenu } from './components/mainMenu.js';
import { FrmEquipos } from './components/frmEquipos.js';
import { FrmPilotos } from './components/frmPilotos.js';
import { FrmVehiculos } from './components/frmVehiculos.js';
import { FrmNoticias } from './components/frmNoticias.js';
import { FrmCircuitos } from './components/frmCircuitos.js';
import { FrmSimulacion } from './components/frmSimulacion.js';

customElements.define('frm-equipos', FrmEquipos);
customElements.define('frm-pilotos', FrmPilotos);
customElements.define('frm-vehiculos', FrmVehiculos);
customElements.define('frm-noticias', FrmNoticias);
customElements.define('frm-circuitos', FrmCircuitos);
customElements.define('frm-simulacion', FrmSimulacion);

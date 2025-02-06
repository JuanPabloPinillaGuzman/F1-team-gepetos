export class FrmNoticias extends HTMLElement {
    constructor() {
      super();
      // Lista de noticias de ejemplo
      this.noticias = [
        {
          pagina: 'https://www.formula1.com/en/latest/article/hamilton-leclerc-and-piastri-in-action-as-pirellis-barcelona-tyre-test.4k5bwGwoPX5RxQz4Ltjnih',
          titulo: 'Hamilton, Leclerc y Piastri en acción al concluir el test de neumáticos de Pirelli en Barcelona',
          descripcion:
            'Lewis Hamilton, Charles Leclerc y Oscar Piastri estuvieron en acción cuando la prueba de neumáticos de Pirelli en el Circuit de Barcelona-Catalunya llegó a su fin el miércoles.',
          imagen: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/t_16by9Centre/f_auto/q_auto/fom-website/2025/Miscellaneous/pirelliprivatetestingbarcelonaday2-16'
        },
        {
          pagina: 'https://www.formula1.com/en/latest/article/aston-martin-confirm-launch-date-for-2025-challenger.dI1DrcgWmpmtXQHittf22',
          titulo: 'Aston Martin confirma la fecha de lanzamiento del Challenger de 2025',
          descripcion:
            'Aston Martin ha anunciado que su coche de F1 2025 saldrá a la luz el 23 de febrero, pocos días después de que el equipo revelara su librea para la campaña durante el evento de lanzamiento de la temporada F1 75 Live en el O2 de Londres el 18 de febrero.',
          imagen: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/t_16by9South/f_auto/q_auto/trackside-images/2024/F1_Grand_Prix_of_Abu_Dhabi___Practice/2188517983'
        },
        {
          pagina: 'https://www.formula1.com/en/latest/article/f1-launches-when-will-teams-be-presenting-their-new-cars-for-the-2025-season.2E2hft0ePqy0DhGlTbBR74',
          titulo: 'LANZAMIENTOS DE F1: ¿Cuándo presentarán los equipos sus nuevos coches para la temporada 2025?',
          descripcion:
            'A medida que se acerca el inicio de la campaña 2025 de F1, es esa época del año en la que, tradicionalmente, los equipos se preparan para presentar sus nuevos coches. Estamos hablando de la temporada de lanzamientos, que este año será un poco diferente, ya que un evento muy especial se une al calendario...',
          imagen: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/t_16by9South/f_auto/q_auto/fom-website/2025/Miscellaneous/GettyImages-2013329938'
        },
        
      ];
      this.render();
    }
  
    render() {
      this.innerHTML = /*html*/ `
        <div class="container mt-4">
          <h2 class="mb-4">Noticias Relevantes de la F1</h2>
          <div class="row">
            ${this.noticias
              .map(
                noticia => `
              <div class="col-md-4 mb-4">
                <div class="card h-100">
                  <img src="${noticia.imagen}" class="card-img-top" alt="${noticia.titulo}">
                  <div class="card-body">
                    <h5 class="card-title">${noticia.titulo}</h5>
                    <p class="card-text">${noticia.descripcion}</p>
                  </div>
                  <div class="card-footer">
                    <a href="${noticia.pagina}" target="_blank" class="btn btn-primary">Leer más</a>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('frm-noticias', FrmNoticias);
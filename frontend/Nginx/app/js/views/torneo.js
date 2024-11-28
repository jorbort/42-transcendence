import { handleRouteChange } from "../mainScript.js";

class torneo extends HTMLElement {
    constructor() {
        super();
        this.app = document.getElementById("app")
        console.log(this.app)
        this.app.innerHTML = /* html */`
        <style>
            .torneo {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 2rem;
            }

            .nivel {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .partido {
                background-color: #fff;
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                box-shadow: 0 4px 6px rgba(1, 1, 0, 0.1);
                width: 150px;
            }

            .jugador, .ganador {
                margin: 0.5rem 0;
                font-size: 14px;
                font-weight: bold;
                color: #773;
            }

            .nivel[data-nivel="Final"] .partido {
                background-color: #fffae6;
                border-color: #ffc107;
            }

            .nivel > .partido:hover {
                background-color: #f9f9f9;
                border-color: #aaa;
                transition: background-color 0.3s, border-color 0.3s;
            }
        </style>
        <div id="torneo">
        </div>`
        const shadow = this.attachShadow({ mode: 'open' });

        this.container = document.getElementById("torneo");
        console.log(this.container)
    }
    connectedCallback(){
        generarTorneoHTML(8, this.container);
    }
    disconnectedCallback(){
    }
}

function generarTorneoHTML(numJugadores, container) {
    if (numJugadores < 2 || numJugadores % 2 !== 0) {
        console.error("El número de jugadores debe ser un número par mayor o igual a 2.");
        return;
    }

    const niveles = Math.log2(numJugadores);

    for (let i = 0; i <= niveles; i++) {
        const nivel = document.createElement('div');
        nivel.className = 'nivel';
        nivel.dataset.nivel = i === niveles ? 'Final' : `Ronda ${niveles - i}`;

        const partidos = Math.pow(2, niveles - i); // Número de partidos por nivel
        for (let j = 0; j < partidos; j++) {
            const partido = document.createElement('div');
            partido.className = 'partido';

            if (i === 0) { // Nivel más bajo (jugadores iniciales)
                partido.innerHTML = `
                    <div class="jugador">Jugador${2 * j + 1}</div>
                    <div class="jugador">Jugador${2 * j + 2}</div>
                    <button id="Play-Game${j}" type="button">PlayGame${j}</button>`;
            } else {
                partido.innerHTML = `<div class="ganador">Ganador ${j + 1}</div>`;
            }
            nivel.appendChild(partido);
        }

        container.appendChild(nivel);
    }
    // document.body.innerHTML = ''; // Limpiar el body

    const playgame = document.getElementById("Play-Game0");
    console.log(playgame)
    if (playgame) {
        playgame.addEventListener('click', () => {
            history.pushState('', '', `/localgame1vs1/Jugador1/Jugador2`);
            handleRouteChange();
        });
    }
}

customElements.define('torneo-torneo', torneo);

export default function rendertorneo () {
    return ('<torneo-torneo></torneo-torneo>');
}
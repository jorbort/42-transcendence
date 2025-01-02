import { handleRouteChange } from "../mainScript.js";

class torneo extends HTMLElement {
    constructor() {
        super();
        this.app = document.getElementById("app")
        this.lastSelect = false;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.firstSelect = false;
        this.SecondSelect = false;
        this.configsaved = false;
        this.qttplayers = 4;
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
    }
    connectedCallback(){
        if (localStorage.getItem("btnsave") == "false" || localStorage.getItem("btnsave") == undefined)
        {
            localStorage.setItem("btnsave", this.configsaved);
            this.createModalData(this.container);    
        }
        generarTorneoHTML(localStorage.getItem("qttplayers") , this.container);
    }
    disconnectedCallback(){
    }

    ModalData() {
        const modalContainer = document.createElement('div');
    
        modalContainer.innerHTML = /* html */`
        <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Custom Game</h5>
                    </div>
                    <div class="modal-body">
                        <form>
                            <!-- Primer Modal Footer con la pregunta -->
                            <div class="modal-footer d-flex justify-content-between align-items-center">
                                <p class="text-start mb-0">¿Quieres aumentar la velocidad de la pelota con el cono?</p>
                                <div>
                                    <button id="btnSpeedYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnSpeedNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                            </div>
    
                            <!-- Segundo Modal Footer con la pregunta -->
                            <div class="modal-footer d-flex justify-content-between align-items-center">
                                <p class="text-start mb-0">¿Quieres disminuir la velocidad de la pelota con el Icosahedron?</p>
                                <div>
                                    <button id="btnSizeYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnSizeNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                            </div>
    
                            <!-- Tercer Modal Footer con la pregunta -->
                            <div class="modal-footer d-flex justify-content-between align-items-center">
                                <p class="text-start mb-0">¿Quieres disminuir la velocidad de las palas con el TorusKnot?</p>
                                <div>
                                    <button id="btnDecreaseYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnDecreaseNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                            </div>
    
                            <!-- Nueva sección con la barra selectora -->
                            <div class="modal-footer d-flex justify-content-between align-items-center">
                                <p class="text-start mb-0">Selecciona la cantidad de jugadores para el torneo:</p>
                                <div>
                                    <input type="range" id="speedSlider" min="0" max="2" step="1" value="0">
                                    <span id="sliderValue">4</span>
                                </div>
                            </div>
    
                            <!-- Botón para guardar la configuración -->
                            <button id="btnSave" type="button" class="btn btn-primary" disabled>Guardar Configuración</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;
    
        // Lógica para el slider
        const slider = modalContainer.querySelector('#speedSlider');
        const sliderValue = modalContainer.querySelector('#sliderValue');
    
        // Valores específicos para el slider
        const values = [4, 8, 12];
    
        // Actualizar el valor mostrado del slider cuando se cambia
        slider.addEventListener('input', () => {
            const selectedValue = values[slider.value];
            sliderValue.textContent = selectedValue;
            this.qttplayers = selectedValue;
        });
    
        return modalContainer;
    }
    
    
    checkSavebtn()
    {
        if (this.firstSelect && this.SecondSelect && this.lastSelect)
        {
            const btnSave = document.getElementById("btnSave");
            btnSave.disabled = false; // Habilita el botón
            btnSave.style.backgroundColor = "#007bff"; // Cambia el color a azul (color por defecto de Bootstrap)
            btnSave.style.cursor = "pointer"; 
        }
    }
    
    createModalData( container )
    {
        const newModal = this.ModalData();
    
        container.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('customModal'), {
            keyboard: false
        });
        myModal.show();
    
        const handleResponse = (responseType, action) => {
            this.checkSavebtn();
        };
    
        function resetButtonStyles(buttonYesId, buttonNoId) {
            const btnYes = document.getElementById(buttonYesId);
            const btnNo = document.getElementById(buttonNoId);
            
            btnYes.style.backgroundColor = "#888";
            btnYes.style.borderColor = "#888"
            btnYes.style.color = "#fff";
            btnNo.style.backgroundColor = "#888";
            btnNo.style.borderColor = "#888"
            btnNo.style.color = "#fff";
    
        }
    
        function initializeButtons() {
            const buttons = ["btnSpeedYes", "btnSpeedNo", "btnSizeYes", "btnSizeNo", "btnDecreaseYes", "btnDecreaseNo"];
            buttons.forEach(buttonId => {
                const btn = document.getElementById(buttonId);
                btn.style.backgroundColor = "#888";
                btn.style.borderColor = "#888"
                btn.style.color = "#fff";
            });
        }
    
        initializeButtons();
    
        document.getElementById("btnSpeedYes").addEventListener('click', () => {
            resetButtonStyles("btnSpeedYes", "btnSpeedNo");
            const btn = document.getElementById("btnSpeedYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom = true;
            this.firstSelect = true;
            handleResponse("Aumentar velocidad", "Si");
        });
    
        document.getElementById("btnSpeedNo").addEventListener('click', () => {
            resetButtonStyles("btnSpeedYes", "btnSpeedNo");
            const btn = document.getElementById("btnSpeedNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.addCustom = false;
            this.firstSelect = true;
            handleResponse("Aumentar velocidad", "No");
        });
    
        document.getElementById("btnSizeYes").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom1 = true;
            this.SecondSelect = true;
            handleResponse("Aumentar tamaño", "Si");
        });
    
        document.getElementById("btnSizeNo").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.SecondSelect = true;
            this.addCustom1 = false;
            handleResponse("Aumentar tamaño", "No");
        });
    
        document.getElementById("btnDecreaseYes").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom2 = true;
            this.lastSelect = true;
            handleResponse("Disminuir tamaño", "Si");
        });
    
        document.getElementById("btnDecreaseNo").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.lastSelect = true;
            this.addCustom2 = false;
            handleResponse("Disminuir tamaño", "No");
        });
    
        document.getElementById("btnSave").addEventListener('click', async () => {
            if (this.firstSelect && this.SecondSelect && this.lastSelect)
            {
                myModal.dispose()
                document.getElementById('customModal').remove();
                localStorage.setItem("addCustom", this.addCustom);
                localStorage.setItem("addCustom1", this.addCustom);
                localStorage.setItem("addCustom2", this.addCustom2);
                this.configsaved = true;
                localStorage.setItem("btnsave", this.configsaved );
                localStorage.setItem("qttplayers", this.qttplayers );
            }
        });
    }
}

function generarTorneoHTML(numJugadores, container) {
    if (numJugadores < 2 || numJugadores % 2 !== 0) {
        return;
    }

    const niveles = Math.log2(numJugadores);

    for (let i = 0; i <= niveles; i++) {
        const nivel = document.createElement('div');
        nivel.className = 'nivel';
        nivel.dataset.nivel = i === niveles ? 'Final' : `Ronda ${niveles - i}`;

        const partidos = Math.pow(2, niveles - i);
        for (let j = 0; j < partidos; j++) {
            const partido = document.createElement('div');
            partido.className = 'partido';

            if (i === 0) {
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

    for (let j = 0; j < numJugadores / 2; j++) {
        const playgameButton = document.getElementById(`Play-Game${j}`);
        if (playgameButton) {
            playgameButton.addEventListener('click', () => {
                const jugador1 = `Jugador${2 * j + 1}`;
                const jugador2 = `Jugador${2 * j + 2}`;
                history.pushState('', '', `/localgame1vs1/${jugador1}/${jugador2}`);
                handleRouteChange();
            });
        }
    }

        // Añadir el botón de limpiar
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Limpiar';
        clearButton.id = 'clear-button';
        container.appendChild(clearButton);
    
        // Añadir el event listener para limpiar
        clearButton.addEventListener('click', () => {
            localStorage.clear();
        });
}


customElements.define('torneo-torneo', torneo);

export default function rendertorneo () {
    return ('<torneo-torneo></torneo-torneo>');
}
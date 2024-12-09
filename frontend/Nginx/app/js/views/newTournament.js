import renderPonTournament from "./pongTournament.js";

class TournamentView extends HTMLElement {
    constructor() {
        super();
        this.tournamentData = {
            name: '',
            date: new Date().toISOString().split('.')[0],
            players: [],
            rounds: [],
            winner: null,
        };
        this.currentMatch = null;
        this.currentRoundIndex = 0;
        this.lastSelect = false;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.firstSelect = false;
        this.SecondSelect = false;
        this.configsaved = false;
        this.qttplayers = 4;
    }

    connectedCallback() {
        this.addStyles();
    }
    ModalData() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
        <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Custom Game</h5>
                        </div>
                        <div class="modal-body">
                            <div>
								<h1>Crear Torneo</h1>
							</div>
							<div>	
								<label for="tournament-name">Nombre del Torneo:</label>
								<input id="tournament-name" type="text" maxlength="13" />
                            </div>
							<form>
                                <div class="modal-footer">
                                    <p>¿Aumentar velocidad con el cono?</p>
                                    <button id="btnSpeedYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnSpeedNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                                <div class="modal-footer">
                                    <p>¿Disminuir velocidad con el Icosahedron?</p>
                                    <button id="btnSizeYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnSizeNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                                <div class="modal-footer">
                                    <p>¿Disminuir velocidad de las palas con el TorusKnot?</p>
                                    <button id="btnDecreaseYes" type="button" class="btn btn-success btn-sm">Sí</button>
                                    <button id="btnDecreaseNo" type="button" class="btn btn-danger btn-sm">No</button>
                                </div>
                                <div class="modal-footer d-flex justify-content-between align-items-center">
                                <p class="text-start mb-0">Selecciona la cantidad de jugadores para el torneo:</p>
                                <div>
                                    <input type="range" id="speedSlider" min="0" max="2" step="1" value="0">
                                    <span id="sliderValue">4</span>
                                </div>
                            </div>
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
        const values = [4, 8, 16];

        // Actualizar el valor mostrado del slider cuando se cambia
        slider.addEventListener('input', () => {
            const selectedValue = values[slider.value];
            sliderValue.textContent = selectedValue;
            this.qttplayers = selectedValue;
        });
        return modalContainer;
    }

    checkSavebtn() {
        if (this.firstSelect && this.SecondSelect && this.lastSelect) {
            const btnSave = document.getElementById("btnSave");
            btnSave.disabled = false; // Habilita el botón
            btnSave.style.backgroundColor = "#007bff"; // Cambia el color a azul (color por defecto de Bootstrap)
            btnSave.style.cursor = "pointer";
        }
    }

    createModalData(container) {
        const newModal = this.ModalData();
        container.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('customModal'), {
            keyboard: false,
            // backdrop: 'static'
        });
        myModal.show();

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
            this.checkSavebtn();
        });

        document.getElementById("btnSpeedNo").addEventListener('click', () => {
            resetButtonStyles("btnSpeedYes", "btnSpeedNo");
            const btn = document.getElementById("btnSpeedNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.addCustom = false;
            this.firstSelect = true;
            this.checkSavebtn();
        });

        document.getElementById("btnSizeYes").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom1 = true;
            this.SecondSelect = true;
            this.checkSavebtn();
        });

        document.getElementById("btnSizeNo").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.SecondSelect = true;
            this.addCustom1 = false;
            this.checkSavebtn();
        });

        document.getElementById("btnDecreaseYes").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom2 = true;
            this.lastSelect = true;
            this.checkSavebtn();
        });

        document.getElementById("btnDecreaseNo").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.lastSelect = true;
            this.addCustom2 = false;
            this.checkSavebtn();
        });

        document.getElementById("btnSave").addEventListener('click', async () => {
            if (this.firstSelect && this.SecondSelect && this.lastSelect) {
                const name = document.getElementById('tournament-name').value;
                if (name) {
                    this.tournamentData.name = name;
                    this.tournamentData.players = Array.from(
                        { length: this.qttplayers }, (_, i) => `Player${i + 1}`
                    );
                    myModal.dispose();
                    document.getElementById('customModal').remove();
                    this.renderEditPlayersView();
                } else
                    alert('Por favor, ingrese un nombre.');
            }
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
.match {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
	margin-bottom: 2rem;
    padding: 1rem;
    background-color: #e0f2fe; /* Azul claro pastel */
    border-radius: 12px;
    position: relative;
    min-width: 140px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.match:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.match span {
    font-size: 1rem;
    margin: 0.5rem 0;
}

.match .winner {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #16a34a; /* Verde para el ganador */
}

.round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: relative;
}

#app{
	display: flex;
}

#tournament-view {
    max-height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 1rem;
}

#bracket {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 1rem; Agregar espacio interno para evitar cortes 
    /*box-sizing: border-box;  Incluir padding en las dimensiones */
}


#tournament-view::-webkit-scrollbar {
    display: none;
}

@media (max-width: 768px) {
    #bracket {
        flex-direction: column;
        gap: 1rem;
    }
}
#edit-players-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0;
	padding: 20px 10px;
    max-height: calc(100vh - 40px); /* Deja algo de espacio para márgenes */
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
    max-height: 80vh; /* Limitar altura máxima */
    overflow-y: auto; /* Habilitar scroll vertical */
    scroll-behavior: smooth; /* Suavizar el desplazamiento */
}

#edit-players-view::-webkit-scrollbar {
    width: 8px; /* Ancho del scroll */
}

#edit-players-view::-webkit-scrollbar-thumb {
    background-color: #3b82f6; /* Color del scroll */
    border-radius: 8px;
}

#edit-players-view h2 {
	margin: 0 0 1rem 0;
    margin-bottom: 1rem;
    color: #334155;
    font-size: 1.5rem;
}

.player-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
}

.player-input label {
    font-size: 1rem;
    color: #475569;
    margin-bottom: 0.5rem;
}

.player-input input {
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    background-color: #f1f5f9;
    color: #334155;
}

.hidden {
    display: none;
  }

button#accept-players {
    padding: 10px 20px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

button#accept-players:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

        `;
        document.head.appendChild(style);
        this.createModalData(document.getElementById("app"));
    }

    renderEditPlayersView() {
        this.innerHTML = `
        <div id="edit-players-view">
            <h2>Editar Jugadores</h2>
            ${this.tournamentData.players.map((player, index) => `
                <div class="player-input">
                    <label for="player-${index}">Jugador ${index + 1}:</label>
                    <input id="player-${index}" data-index="${index}" value="${player}" maxlength="13" />
                </div>
            `).join('')}
            <button id="accept-players">Aceptar</button>
        </div>
    `;
        this.querySelector('#accept-players').addEventListener('click', () => {
            this.tournamentData.players = Array.from(
                this.querySelectorAll('input[data-index]'),
                input => input.value
            );
            this.initializeTournament();
        });
    }


    initializeTournament() {
        const shuffledPlayers = this.tournamentData.players.sort(() => Math.random() - 0.5);
        this.tournamentData.rounds = [];
        let currentRound = [...shuffledPlayers];
        while (currentRound.length > 1) {
            const nextRound = [];
            const roundMatches = [];
            for (let i = 0; i < currentRound.length; i += 2) {
                const match = {
                    player1: currentRound[i],
                    player2: currentRound[i + 1] || null,
                    winner: null
                };
                roundMatches.push(match);
                nextRound.push(null);
            }
            this.tournamentData.rounds.push(roundMatches);
            currentRound = nextRound;
        }
        this.renderTournamentView();
    }

    renderTournamentView() {
        if (this.tournamentData.winner) {
            this.renderFinalView();
            return;
        }
        this.innerHTML = `
		<div id="tournament-view">
            <div id="bracket">
                ${this.tournamentData.rounds.map((round, roundIndex) => `
                    <div class="round">
                        <h3>Ronda ${roundIndex + 1}</h3>
                        ${round.map((match, matchIndex) => `
                            <div class="match">
                                <span>${match.player1 || '---'} vs ${match.player2 || '---'}</span>
                                ${match.winner ? `<span>Ganador: ${match.winner}</span>` : `<button 
                                    class="start-match" 
                                    data-round-index="${roundIndex}" 
                                    data-match-index="${matchIndex}"
                                    ${this.currentMatch || !match.player1 || !match.player2 ? 'disabled' : ''}>
                                    
                                    Jugar
                                   </button>`
            }
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            <div id="game-container"></div>
        </div>
    `;
        const buttons = this.querySelectorAll('.start-match');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                buttons.forEach(btn => btn.disabled = true);
                const roundIndex = parseInt(button.dataset.roundIndex, 10);
                const matchIndex = parseInt(button.dataset.matchIndex, 10);
                const match = this.tournamentData.rounds[roundIndex][matchIndex];
                this.currentMatch = match;
                this.startGame1(match.player1, match.player2, (winner) => {
                    match.winner = winner;
                    if (roundIndex + 1 < this.tournamentData.rounds.length) {
                        const nextMatchIndex = Math.floor(matchIndex / 2);
                        this.tournamentData.rounds[roundIndex + 1][nextMatchIndex][
                            matchIndex % 2 === 0 ? 'player1' : 'player2'
                        ] = winner;
                    } else {
                        this.tournamentData.winner = winner;
                        buttons.forEach(btn => btn.disabled = false);
                    }
                    this.currentMatch = null;
                    this.renderTournamentView();
                });
            });
        });
    }

    renderFinalView() {
        this.innerHTML = `
            <div id="tournament-final-view">
                <div id="bracket">${this.generateBracketHTML()}</div>
                <div id="winner">
                    <h2>¡Ganador del Torneo!</h2>
                    <p>${this.tournamentData.winner}</p>
                    <button id="save-winner">Guardar Ganador</button>
                </div>
            </div>
        `;

        this.querySelector('#save-winner').addEventListener('click', () => {
            this.saveWinner(this.tournamentData.winner);
        });
    }

    startGame1(player1, player2, onGameEnd) {
        const brackets = this.querySelector('#bracket');
        //brackets.classList.add('hidden');
        brackets.innerHTML = '';
        const gameContainer = this.querySelector('#game-container');
        const pongGame = renderPonTournament(this.currentMatch, this.currentRoundIndex, this.lastSelect, this.addCustom,
            this.addCustom1, this.addCustom2, player1, player2, onGameEnd);
        gameContainer.innerHTML = '';

        gameContainer.appendChild(pongGame);
    }

    generateBracketHTML() {
        return this.tournamentData.rounds.map((round, roundIndex) => `
            <div class="round">
                <h3>Ronda ${roundIndex + 1}</h3>
                <div class="matches">
                    ${round.map(match => `
                        <div class="match">
                            <span>${match.player1 || '---'}</span>
                            <span>vs</span>
                            <span>${match.player2 || '---'}</span>
                            ${match.winner ? `<div class="winner">Ganador: ${match.winner}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }


    saveWinner(winner) {
        // Aquí puedes implementar la lógica para guardar el ganador,
        // por ejemplo, enviar una solicitud a un servidor o guardar en localStorage
        console.log(`Ganador ${winner} guardado.`);
        alert(`El ganador ${winner} ha sido guardado.`);
    }
}
customElements.define('tournament-view', TournamentView);
export default function renderTournamentApp() {
    return '<tournament-view></tournament-view>';
}

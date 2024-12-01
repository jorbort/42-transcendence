import renderPonTournament from "./ponTornament.js";
class TournamentView extends HTMLElement {
    constructor() {
        super();
        this.tournamentData = {
            name: '',
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
                            <div id="config-view">
                                <h1>Crear Torneo</h1>
                                <label>Nombre del Torneo: <input id="tournament-name" type="text" /></label>
                                <label>Cantidad de Jugadores: <input id="player-count" type="number" min="2" step="2" /></label>
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
                                <button id="btnSave" type="button" class="btn btn-primary" disabled>Guardar Configuración</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;
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
            backdrop: 'static' 
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
                const playerCount = parseInt(document.getElementById('player-count').value, 10);
                if (name && playerCount % 2 == 0) {
                    this.tournamentData.name = name;
                    this.tournamentData.players = Array.from(
                        { length: playerCount },
                        (_, i) => `Player${i + 1}`
                    );
                    myModal.dispose()
                    document.getElementById('customModal').remove();
                    this.renderEditPlayersView();
                } else 
                    alert('Por favor, ingrese un nombre y una cantidad válida de jugadores.'); 
            }
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: row;
                height: 100vh;
                overflow: hidden;
            }

            #config-view, #edit-players-view, #tournament-view {
                flex: 1;
                justify-content: center;
                padding: 15px;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                margin: 20px;
                overflow-y: auto;
            }

            #tournament-view {
                justify-content: center;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            #final-view {
                text-align: center;
                padding: 20px;
            }

            h2, h1 {
                justify-content: center;
                text-align: center;
                color: #333;
            }

            label {
                justify-content: center;
                display: flex;
                text-align: center;
                margin-bottom: 10px;
                font-size: 1rem;
                color: #555;
            }

            input {
                justify-content: left;
                padding: 5px 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                width: calc(100% - 20px);
                margin-bottom: 15px;
            }

            button {
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s;
            }

            button:hover {
                background: #0056b3;
            }

            .match span {
                font-weight: bold;
            }

            .match .line {
                width: 2px;
                height: 50px;
                background: #333;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            canvas {
                border: 1px solid #000;
                background: #000;
            }
        
        #bracket {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem;
    gap: 2rem;
    position: relative;
}

.round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    position: relative;
}

.match {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem;
    background-color: #e5e7eb; /* Color de fondo claro */
    border-radius: 8px;
    position: relative;
    min-width: 120px;
}

.match span {
    font-size: 1rem;
    margin: 0.2rem 0;
}

.match .winner {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #10b981; /* Verde para el ganador */
}

/* Conexiones entre partidos */
.match::before,
.match::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 50%;
    background-color: #333;
}

.match::before {
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
}

.match::after {
    bottom: -50%;
    left: 50%;
    transform: translateX(-50%);
}

.round .matches::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #333;
    left: -10px;
}

.round .matches:last-child::after {
    display: none;
}

@media (max-width: 768px) {
    #bracket {
        flex-direction: column;
        gap: 1rem;
    }
    .match::before,
    .match::after {
        display: none;
    }
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
                    <div>
                        <label>Jugador ${index + 1}: 
                            <input data-index="${index}" value="${player}" />
                        </label>
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
                                ${match.winner
            ? `<span>Ganador: ${match.winner}</span>`
            : `<button 
                                    class="start-match" 
                                    data-round-index="${roundIndex}" 
                                    data-match-index="${matchIndex}"
                                    ${this.currentMatch ? 'disabled' : ''}
                                    ${!match.player1 || !match.player2 ? 'disabled' : ''}>
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
                        //  this.renderFinalView();
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

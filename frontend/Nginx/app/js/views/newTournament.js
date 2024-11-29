import renderPonTournament from "./ponTornament.js";

class TournamentView extends HTMLElement {
    constructor() {
        super();
        this.tournamentData = {
            name: '',
            players: [],
            rounds: []
        };
        this.currentMatch = null;
    }

    connectedCallback() {
        this.addStyles();
        this.renderConfigView();
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
                padding: 20px;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                margin: 20px;
                overflow-y: auto;
            }

            #tournament-view {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            h2 {
                text-align: center;
                color: #333;
            }

            label {
                display: block;
                margin-bottom: 10px;
                font-size: 1rem;
                color: #555;
            }

            input {
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

            .round {
                margin: 10px;
                padding: 10px;
                background: #f4f4f9;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            .match {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 10px 0;
            }

            .match div {
                margin-bottom: 5px;
                font-weight: bold;
            }

            #game-container {
                flex: 2;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #ffffff;
                border-radius: 10px;
                margin: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            #bracket {
                flex: 1;
                max-height: 90vh;
                overflow-y: auto;
                border-right: 1px solid #ddd;
                padding-right: 20px;
            }

            canvas {
                border: 1px solid #000;
                background: #000;
            }
        `;
        document.head.appendChild(style);
    }

    renderConfigView() {
        this.innerHTML = `
            <div id="config-view">
                <label>Nombre del Torneo: <input id="tournament-name" type="text" /></label>
                <label>Cantidad de Jugadores: <input id="player-count" type="number" min="2" step="2" /></label>
                <button id="create-tournament">Crear</button>
            </div>
        `;
        this.querySelector('#create-tournament').addEventListener('click', () => {
            const name = this.querySelector('#tournament-name').value;
            const playerCount = parseInt(this.querySelector('#player-count').value, 10);

            if (name && playerCount >= 2) {
                this.tournamentData.name = name;
                this.tournamentData.players = Array.from(
                    { length: playerCount },
                    (_, i) => `Player${i + 1}`
                );
                this.renderEditPlayersView();
            } else {
                alert('Por favor, ingrese un nombre y una cantidad válida de jugadores.');
            }
        });
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
        const { players } = this.tournamentData;

        this.tournamentData.rounds = [];
        let currentRound = players.slice();

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
        this.innerHTML = `
            <div id="tournament-view">
                <div id="bracket">
                    ${this.tournamentData.rounds.map((round, roundIndex) => `
                        <div class="round">
                            <h3>Ronda ${roundIndex + 1}</h3>
                            ${round.map(match => `
                                <div class="match">
                                    <div>${match.player1 || ''} vs ${match.player2 || ''}</div>
                                    <button ${!match.player1 || !match.player2 ? 'disabled' : ''} 
                                            data-round-index="${roundIndex}" 
                                            class="start-match">Comenzar Partida</button>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div id="game-container"></div>
            </div>
        `;

        this.querySelectorAll('.start-match').forEach(button => {
            button.addEventListener('click', (event) => {
                const roundIndex = parseInt(event.target.dataset.roundIndex, 10);
                const match = this.tournamentData.rounds[roundIndex];
                this.currentMatch = match;
                this.startGame1(match.player1, match.player2);
            });
        });
    }
    startGame1(player1, player2) {
        const gameContainer = this.querySelector('#game-container');
        gameContainer.innerHTML = renderPonTournament(player1, player2, (winner) => {
            this.finishMatch(winner);
        });
    }
    finishMatch(winner) {
        this.currentMatch.winner = winner;
        this.renderTournamentView();
    }
}

customElements.define('tournament-view', TournamentView);

//document.body.innerHTML = '<tournament-view></tournament-view>';

export default function renderTournamentApp() {
    return '<tournament-view></tournament-view>';
}

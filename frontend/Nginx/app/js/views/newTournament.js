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

            #final-view {
                text-align: center;
                padding: 20px;
            }

            h2, h1 {
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
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
            }

            .match {
                position: relative;
                margin: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
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
        `;
        document.head.appendChild(style);
    }

    renderConfigView() {
        this.innerHTML = `
            <div id="config-view">
                <h1>Crear Torneo</h1>
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
                                                ${!match.player1 || !match.player2 || this.currentMatch ? 'disabled' : ''}>
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

        this.querySelectorAll('.start-match').forEach(button => {
            button.addEventListener('click', (e) => {
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
                      //  this.renderFinalView();
                    }
                    this.currentMatch = null;
                    this.renderTournamentView();
                });
            });
        });
    }

    // startGame1(player1, player2, onGameEnd) {
    //     // const gameContainer = this.querySelector('#game-container');
    //     // const pongGame = renderPonTournament(player1, player2, onGameEnd);
    //     // gameContainer.innerHTML = '';
    //     // gameContainer.appendChild(pongGame);
    //     const gameContainer = this.querySelector('#game-container');
    //     const pongGame = renderPonTournament(player1, player2, (winner) => {
    //         console.log("tenemos ganador" + winner);
    //         this.currentMatch.winner = winner;
    //         this.renderTournamentView();
    //     });
    //     // Verifica que pongGame sea un nodo antes de insertarlo
    //         gameContainer.innerHTML = ''; // Limpia el contenedor
    //         gameContainer.appendChild(pongGame); // Inserta el nodo válido
    // }
    startGame1(player1, player2, onGameEnd) {
        const gameContainer = this.querySelector('#game-container');
        const pongGame = renderPonTournament(player1, player2, onGameEnd);
        gameContainer.innerHTML = ''; 
        gameContainer.appendChild(pongGame);
    }
}
customElements.define('tournament-view', TournamentView);
export default function renderTournamentApp() {
    return '<tournament-view></tournament-view>';
}

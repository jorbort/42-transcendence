import renderPongGame from './ponTornamentGame.js'; // Importamos la función renderPongGame

class TournamentApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tournamentData = {
            name: '',
            players: [],
            rounds: [],
            winner: null,
        };
        this.currentRoundIndex = 0;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Arial', sans-serif;
                    max-width: 800px;
                    margin: 20px auto;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 16px;
                    background-color: #fdfdfd;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }

                h1, h2 {
                    text-align: center;
                    color: #333;
                }

                label {
                    display: block;
                    margin-top: 12px;
                    font-size: 1rem;
                    color: #555;
                    font-weight: bold;
                }

                input, button {
                    width: 100%;
                    padding: 10px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 1rem;
                }

                button {
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background-color: #0056b3;
                }

                .player-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    padding: 0;
                    list-style: none;
                    margin: 20px 0;
                }

                .player-item {
                    padding: 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
                }

                .player-item input {
                    margin-top: 10px;
                    font-size: 1rem;
                    padding: 6px;
                    width: 90%;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    text-align: center;
                }

                .player-item label {
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                #start-tournament {
                    width: auto;
                    margin: 20px auto;
                    display: block;
                    padding: 12px 24px;
                    font-size: 1.2rem;
                }
            </style>
            <div id="tournament-container">
                <form id="tournament-form">
                    <h1>Crear Torneo</h1>
                    <label for="name">Nombre del Torneo:</label>
                    <input type="text" id="name" required placeholder="Nombre del torneo">
                    <label for="players">Cantidad de Jugadores:</label>
                    <input type="number" id="players" min="2" step="2" required placeholder="Número par de jugadores">
                    <button type="submit">Crear</button>
                </form>
            </div>
        `;

        this.shadowRoot
            .querySelector('#tournament-form')
            .addEventListener('submit', (e) => this.handleTournamentCreation(e));
    }

    handleTournamentCreation(event) {
        event.preventDefault();
        const name = this.shadowRoot.querySelector('#name').value;
        const playersCount = parseInt(this.shadowRoot.querySelector('#players').value, 10);

        this.tournamentData.name = name;
        this.tournamentData.players = Array.from({ length: playersCount }, (_, i) => `Player${i + 1}`);
        this.showPlayerEditingView();
    }

    showPlayerEditingView() {
        const playersList = this.tournamentData.players
            .map(
                (player, index) => `
                <li class="player-item">
                    <label for="player-${index}">Jugador ${index + 1}</label>
                    <input type="text" id="player-${index}" value="${player}">
                </li>
            `
            )
            .join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Arial', sans-serif;
                    max-width: 800px;
                    margin: 20px auto;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 16px;
                    background-color: #fdfdfd;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    text-align: center;
                    color: #444;
                }

                .player-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    padding: 0;
                    list-style: none;
                    margin: 20px 0;
                }

                .player-item {
                    padding: 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
                }

                .player-item input {
                    margin-top: 10px;
                    font-size: 1rem;
                    padding: 6px;
                    width: 90%;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    text-align: center;
                }

                #start-tournament {
                    display: block;
                    margin: 20px auto;
                    padding: 12px 24px;
                    font-size: 1.2rem;
                    color: #fff;
                    background-color: #28a745;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                #start-tournament:hover {
                    background-color: #218838;
                }
            </style>
            <h1>${this.tournamentData.name}</h1>
            <ul class="player-list">
                ${playersList}
            </ul>
            <button id="start-tournament">Comenzar Torneo</button>
        `;

        this.shadowRoot
            .querySelector('#start-tournament')
            .addEventListener('click', () => this.startTournament());
    }

    startTournament() {
        this.tournamentData.players = this.tournamentData.players.map((_, index) =>
            this.shadowRoot.querySelector(`#player-${index}`).value
        );
        this.generateRounds();
        this.showRoundView();
    }

    generateRounds() {
        const shuffledPlayers = [...this.tournamentData.players].sort(() => Math.random() - 0.5);
        while (shuffledPlayers.length > 1) {
            const round = [];
            for (let i = 0; i < shuffledPlayers.length; i += 2) {
                round.push({
                    player1: shuffledPlayers[i],
                    player2: shuffledPlayers[i + 1],
                    winner: null,
                });
            }
            this.tournamentData.rounds.push(round);
            shuffledPlayers.length = Math.ceil(shuffledPlayers.length / 2);
        }
    }

    async startMatch(event) {
        const matchIndex = parseInt(event.target.getAttribute('data-index'), 10);
        const match = this.tournamentData.rounds[this.currentRoundIndex][matchIndex];
        const isAI = match.player2 === 'AI'; // Supongamos que el jugador IA se llama "AI".
    
        try {
            // Esperar a que el juego termine y devuelva un ganador
            const winner = await renderPongGame(match.player1, match.player2, isAI);
    
            // Actualizar los datos del torneo
            match.winner = winner;
    
            // Mostrar el ganador
            alert(`Ganador: ${winner}`);
    
            // Actualizar la vista
            const matchElement = this.shadowRoot.querySelector(`[data-index="${matchIndex}"]`).parentElement;
            matchElement.innerHTML = `<p>Ganador: <strong>${winner}</strong></p>`;
        } catch (error) {
            console.error('Error al jugar el partido:', error);
        }
    }
    
    completeRound() {
        const currentRound = this.tournamentData.rounds[this.currentRoundIndex];
        if (currentRound.some((match) => !match.winner)) {
            alert('Debes completar todos los partidos de la ronda.');
            return;
        }

        if (this.currentRoundIndex < this.tournamentData.rounds.length - 1) {
            this.currentRoundIndex++;
            this.showRoundView();
        } else {
            this.tournamentData.winner = currentRound[0].winner;
            this.saveTournament();
            this.showWinnerView();
        }
    }

    saveTournament() {
        fetch('/api/tournaments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.tournamentData),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Error al guardar el torneo.');
                return response.json();
            })
            .then((data) => console.log('Torneo guardado:', data))
            .catch((err) => console.error(err));
    }

    showRoundView() {
        const currentRound = this.tournamentData.rounds[this.currentRoundIndex];
        const matchesList = currentRound
            .map(
                (match, index) => `
                <li>
                    <p>${match.player1} vs ${match.player2}</p>
                    <button data-index="${index}" class="start-match">Comenzar Partido</button>
                </li>
            `
            )
            .join('');

        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()} /* Inserta estilos reutilizables */
            </style>
            <h1>${this.tournamentData.name}</h1>
            <h2>Ronda ${this.currentRoundIndex + 1}</h2>
            <ul class="matches-list">
                ${matchesList}
            </ul>
            <button id="complete-round">Completar Ronda</button>
        `;

        this.shadowRoot.querySelectorAll('.start-match').forEach((button) =>
            button.addEventListener('click', (e) => this.startMatch(e))
        );

        this.shadowRoot
            .querySelector('#complete-round')
            .addEventListener('click', () => this.completeRound());
    }

    showWinnerView() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()} /* Inserta estilos reutilizables */
            </style>
            <h1>¡Tenemos un ganador!</h1>
            <h2 class="winner">${this.tournamentData.winner}</h2>
            <button id="restart">Iniciar otro Torneo</button>
        `;

        this.shadowRoot
            .querySelector('#restart')
            .addEventListener('click', () => this.restart());
    }

    restart() {
        this.tournamentData = { name: '', players: [], rounds: [], winner: null };
        this.currentRoundIndex = 0;
        this.render();
    }

    styles() {
        return `
            :host { font-family: Arial, sans-serif; }
            button { cursor: pointer; background: #28a745; color: white; padding: 10px; border: none; }
        `;
    }
}

customElements.define('tournament-app', TournamentApp);

export default function renderTournamentApp() {
    return '<tournament-app></tournament-app>';
}

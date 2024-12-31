import renderPonTournament from "./pongTournament.js";
import { connectToMetaMask, saveToBlockchain } from './blockchain.js';
import { handleRouteChange } from "../mainScript.js";
import { getCookie } from '../webComponents/friendsListComponent.js';

class TournamentView extends HTMLElement {
    constructor() {
        super();
        this.tournamentData = { name: '', date: new Date().toISOString().split('.')[0], players: [], rounds: [], winner: null, };
        this.currentMatch = null;
        this.currentRoundIndex = 0;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.configsaved = false;
        this.qttplayers = 4;
        this.IAplayers = 1;
        this.IA = false;
        this.playeron = false;
    }
    connectedCallback() {
        this.addStyles();
    }
    createFormData(container) {
        const formContainer = document.createElement('div');
        formContainer.id = 'form-container'; // Asignar un ID para manejar la visibilidad
        formContainer.innerHTML = `
        <div class="form-container">
            <h1>Crear Torneo</h1>
            <div style="margin-bottom: 10px;">
                <label for="tournament-name">Nombre del Torneo:</label>
                <input id="tournament-name" type="text" maxlength="13" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;" />
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkSpeed"> Aumentar velocidad con el cono
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkSize"> Disminuir velocidad con el Icosahedron
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkDecrease"> Disminuir velocidad de las palas con el TorusKnot
                </label>
            </div>
            <div style="margin-bottom: 20px;">
                <p>Selecciona la cantidad de jugadores para el torneo:</p>
                <input type="range" id="speedSlider" min="0" max="2" step="1" value="0" style="width: 100%;">
                <span id="sliderValue">4</span>
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkIA"> Habilitar IA
                </label>
            </div>
            <div id="aiPlayerCountContainer" style="margin-bottom: 20px; display: none;">
                <p>Selecciona la cantidad de jugadores IA:</p>
                <input type="range" id="aiPlayerSlider" min="1" max="2" step="1" value="1" style="width: 100%;">
                <span id="aiSliderValue">1</span>
            </div>
            <button id="btnSave" type="button" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Configuración</button>
        </div>`;
        const slider = formContainer.querySelector('#speedSlider');
        const sliderValue = formContainer.querySelector('#sliderValue');
        const aiSlider = formContainer.querySelector('#aiPlayerSlider');
        const aiSliderValue = formContainer.querySelector('#aiSliderValue');
        const values = [4, 8, 16];
        slider.addEventListener('input', () => {
            const selectedValue = values[slider.value];
            sliderValue.textContent = selectedValue;
            this.qttplayers = selectedValue;
            this.updateAIPlayerCount();
        });
        aiSlider.addEventListener('input', () => {
            const selectedValue = aiSlider.value;
            aiSliderValue.textContent = selectedValue;
            this.IAplayers = selectedValue;
        }); // Mostrar/Ocultar el contenedor de IA
        formContainer.querySelector('#chkIA').addEventListener('change', () => {
            const aiPlayerCountContainer = formContainer.querySelector('#aiPlayerCountContainer');
            aiPlayerCountContainer.style.display = formContainer.querySelector('#chkIA').checked ? 'block' : 'none';
            this.updateAIPlayerCount();
        });// Lógica para actualizar el slider de IA basado en el slider principal
        this.updateAIPlayerCount = () => {
            const maxAIPlayers = values[slider.value] - 1;
            aiSlider.max = maxAIPlayers;
            aiSliderValue.textContent = Math.min(aiSlider.value, maxAIPlayers);
        }; // Manejo del botón Guardar
        formContainer.querySelector('#btnSave').addEventListener('click', () => {
            const name = formContainer.querySelector('#tournament-name').value;
            const user = localStorage.getItem('username')
            if (name) {
                this.tournamentData.name = name;
                if (formContainer.querySelector('#chkIA').checked) this.IA = true;
                const realPlayersCount = this.qttplayers - (this.IA ? this.IAplayers : 0);
                const aiPlayersCount = this.IA ? this.IAplayers : 0;
                this.tournamentData.players = [
                    { type: 'REAL', name: user },
                    ...Array.from({ length: realPlayersCount - 1 }, (_, i) => ({ type: 'REAL', name: `GAMER${i + 1}` })),
                    ...Array.from({ length: aiPlayersCount }, (_, i) => ({ type: 'AI', name: `IA${i + 1}` }))
                ];
                if (formContainer.querySelector('#chkSpeed').checked) this.addCustom = true;
                if (formContainer.querySelector('#chkSize').checked) this.addCustom1 = true;
                if (formContainer.querySelector('#chkDecrease').checked) this.addCustom2 = true;
                container.removeChild(formContainer);// Ocultar el formulario y mostrar la vista de edición de jugadores
                this.renderEditPlayersView();
            } else
                alert('Por favor, ingrese un nombre para el torneo.');
        });
        container.appendChild(formContainer);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .form-container {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 12px;
            max-width: 400px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-container h1 {
            font-size: 1.5rem;
            color: #334155;
            margin-bottom: 1rem;
            text-align: center;
        }
        .form-container label {
            font-size: 1rem;
            color: #475569;
            margin-bottom: 0.5rem;
        }
        .form-container input[type="text"] {
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 1rem;
            width: 100%;
            background-color: #f1f5f9;
            color: #334155;
        }
        .form-container input[type="checkbox"] {
            margin-right: 10px;
        }
        .form-container input[type="range"] {
            width: 100%;
            margin-top: 5px;
        }
        .form-container span {
            font-size: 1rem;
            color: #475569;
        }
        .form-container button {
            padding: 10px 20px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .form-container button:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .form-container .slider-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .hidden {
            display: none;
        }
#form-container {
	padding-top: 4rem;
	padding-bottom: 15rem;
	overflow-y: auto;
	height: 100vh;
    scroll-behavior: smooth;
}
#form-container::-webkit-scrollbar {
    display: none;
}
.match {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
	margin-bottom: 2rem;
    padding: 1rem;
    background-color: #e0f2fe;
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
    color: #16a34a;
}
.round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: relative;
}
#bracket h3 {
    color: #4A90E2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
#bracket {
    display: flex;
    justify-content: center;
    align-items: center;
	padding: 0px 10px;
    gap: 3rem;	
}
#winner {
	padding-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    position: relative;
}
#winner-buttons {
    display: flex;
    justify-content: space-between;
    width: 40%;
    margin-top: auto;
    gap: 2rem;
}
#winner-buttons button {
    flex: 1;
    padding: 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
#winner-buttons button:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
#winner-buttons button#new-tournament {
    background-color: #28a745;
    color: white;
}
#winner-buttons button#new-tournament:hover {
    background-color: #218838;
}
#winner-buttons button#save-winner {
    background-color: #007bff;
    color: white;
}
#winner-buttons button#save-winner:hover {
    background-color: #0056b3;
}
#winner-buttons button#exit {
    background-color: #dc3545;
    color: white;
}
#winner-buttons button#exit:hover {
    background-color: #c82333;
}
#tournament-view {
	padding-top: 2rem;
	padding-bottom: 10rem;
    max-height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
}
#tournament-view::-webkit-scrollbar {
    display: none;
}
#tournament-final-view {
	padding-bottom: 15rem;
	padding-top: 2rem;
    max-height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
}
#tournament-final-view::-webkit-scrollbar {
    display: none;
}
#edit-players-view h2 {
	margin: 0 0 1rem 0;
    margin-bottom: 1rem;
    color: #334155;
    font-size: 1.5rem;
}
#tournament-final-view h2 {
    font-size: 2rem;
    color: #4A90E2;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
#tournament-final-view p {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 50px;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 500;
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
`;
        document.head.appendChild(style);
        const savedData = localStorage.getItem('tournamentData');
        if (savedData) {
            this.tournamentData = JSON.parse(savedData);
            this.renderTournamentView();
        }
        else
            this.createFormData(document.getElementById("app"));
    }
    renderEditPlayersView() {
        const realPlayers = this.tournamentData.players.filter(player => player.type === 'REAL');
        if (realPlayers.length - 1 === 0) {
            this.initializeTournament();
            return; // Salir de la función si no hay jugadores
        }
        this.innerHTML = `<div id="form-container">
		<div class="form-container">
            <h2>Editar Jugadores</h2>
            ${realPlayers.slice(1)  // Omitir el primer jugador
                .map((player, index) => `
                    <div class="player-input">
                        <label for="player-${index + 1}">Jugador ${index + 2}:</label>
                        <input id="player-${index + 1}" data-index="${index + 1}"value="${player.name}" maxlength="15" />
                    </div>
                `).join('')}
            <div id="error-message" style="color: red; display: none;"></div>
            <button id="btnSave" type="button" style="width: 40%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">ACEPTAR</button>
        </div></div>`;
        this.querySelector('#btnSave').addEventListener('click', () => {
            const inputs = Array.from(this.querySelectorAll('input[data-index]'));
            const updatedPlayers = inputs.map(input => {
                const index = parseInt(input.dataset.index, 10);
                return { index, name: input.value.trim() };
            });
            const errorMessageElement = this.querySelector('#error-message');// Validar nombres vacíos
            if (updatedPlayers.some(player => player.name === "")) {
                errorMessageElement.textContent = 'Todos los jugadores deben tener un nombre.';
                errorMessageElement.style.display = 'block';
                return; // Detener la ejecución si hay campos vacíos
            }// Validar nombres únicos
            const uniqueNames = new Set(updatedPlayers.map(player => player.name));
            if (uniqueNames.size !== updatedPlayers.length) {
                errorMessageElement.textContent = 'Los nombres de los jugadores deben ser diferentes.';
                errorMessageElement.style.display = 'block';
                return; // Detener la ejecución si hay duplicados
            }// Si no hay errores, actualizar los datos y continuar
            errorMessageElement.style.display = 'none';
            updatedPlayers.forEach(({ index, name }) => {
                if (this.tournamentData.players[index]) { // Asegurarse de que el jugador existe
                    this.tournamentData.players[index].name = name;
                } else {
                    console.warn(`El jugador con índice ${index} no existe en la lista de jugadores.`);
                }
            });
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
        this.saveTournamentData()
        this.renderTournamentView();
    }
    saveTournamentData() {
        localStorage.setItem('tournamentData', JSON.stringify(this.tournamentData));
    }
    renderTournamentView() {
        if (this.tournamentData.winner) {
            this.renderFinalView();
            return;
        }
        this.innerHTML = `<div id="tournament-view">
            <div id="bracket">
                ${this.tournamentData.rounds.map((round, roundIndex) => `
                    <div class="round">
                        <h3>Ronda ${roundIndex + 1}</h3>
                        ${round.map((match, matchIndex) => `
                            <div class="match">
                                <span>
                                    ${match.player1 ? match.player1.name : '---'}: ${match.player1_score != null ? match.player1_score : (match.winner ? 0 : '_')} vs 
                                    ${match.player2 ? match.player2.name : '---'}: ${match.player2_score != null ? match.player2_score : (match.winner ? 0 : '_')}
                                </span>
                                ${match.winner ? `
                                    <span class="winner">Ganador: ${match.winner.name}</span>` : `
                                    <button 
                                        class="start-match" 
                                        data-round-index="${roundIndex}" 
                                        data-match-index="${matchIndex}"
                                        ${this.currentMatch || !match.player1 || !match.player2 ? 'disabled' : ''}> 
                                        Jugar
                                    </button>`}
                            </div>`).join('')}
                    </div>`).join('')}
            </div>
            <div id="game-container"></div>
        </div>`;
        const buttons = this.querySelectorAll('.start-match');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                buttons.forEach(btn => btn.disabled = true);
                const tournamentView = this.querySelector('#tournament-view');
                tournamentView.style.paddingTop = '0rem';
                tournamentView.style.paddingBottom = '0rem';
                const roundIndex = parseInt(button.dataset.roundIndex, 10);
                const matchIndex = parseInt(button.dataset.matchIndex, 10);
                const match = this.tournamentData.rounds[roundIndex][matchIndex];
                this.currentMatch = match; // Iniciar el juego y recibir puntajes
                this.startMatch(match.player1, match.player2, (winner, player1Score, player2Score) => {
                    match.winner = winner;
                    match.player1_score = player1Score;
                    match.player2_score = player2Score;
                    if (match.player2.type === 'AI' && match.player1.type === 'REAL') {
                        match.player1_score = player2Score;
                        match.player2_score = player1Score;
                    }

                    if (roundIndex + 1 < this.tournamentData.rounds.length) {
                        const nextMatchIndex = Math.floor(matchIndex / 2);
                        this.tournamentData.rounds[roundIndex + 1][nextMatchIndex][matchIndex % 2 === 0 ? 'player1' : 'player2'] = winner;
                    } else {
                        this.tournamentData.winner = winner;
                        buttons.forEach(btn => btn.disabled = false);
                    }
                    this.currentMatch = null;
                    this.saveTournamentData();
                    tournamentView.style.paddingTop = '2rem';
                    tournamentView.style.paddingBottom = '10rem';
                    this.renderTournamentView();
                });
            });
        });
    }

    async save_tournament() {
        try {
            const payload = {
                name: this.tournamentData.name, // Nombre del torneo
                date: this.tournamentData.date, // Fecha del torneo
                players: this.tournamentData.players.map(player => player.name), // Lista de nombres de jugadores
                rounds: this.tournamentData.rounds.map(round =>
                    round.map(match => ({
                        player1: match.player1.name, // Nombre del jugador 1
                        player2: match.player2.name, // Nombre del jugador 2
                        player1_score: match.player1_score, // Puntuación del jugador 1
                        player2_score: match.player2_score, // Puntuación del jugador 2
                        winner: match.winner.name // Nombre del ganador
                    }))),
                winner: this.tournamentData.winner.name // Nombre del ganador del torneo
            };
            const token = getCookie('access_token');
            const response = await fetch('https://localhost:3042/api/tournaments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Agregar el token al encabezado
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                console.error('Error al guardar el ganador:', response.statusText);
                alert('No se pudo guardar el ganador.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al conectarse con el servidor.');
        }
    }
    renderFinalView() {
        this.innerHTML = `<div id="tournament-final-view">
                <div id="bracket">${this.generateBracketHTML()}</div>
                <div id="winner">
                    <h2>¡Ganador del Torneo!</h2>
					<p class="gradient-text">${this.tournamentData.winner.name}</p>
                    <div id="winner-buttons">
						<button id="new-tournament">Nuevo torneo</button>
            			<button id="save-winner">Guardar resultado</button>
            			<button id="exit">Salir</button>
        			</div>
                </div>
            </div>`;
        this.save_tournament();
        localStorage.removeItem('tournamentData');
        history.replaceState(null, '', window.location.href);
        document.querySelector('#new-tournament').addEventListener('click', () => {
            location.reload();
        });
        document.querySelector('#save-winner').addEventListener('click', async () => {
            const connected = await connectToMetaMask();
            if (!connected) return;
            await saveToBlockchain(this.tournamentData.name, this.tournamentData.date, this.tournamentData.winner.name);
        });
        document.querySelector('#exit').addEventListener('click', async () => {
            history.pushState('', '', '/Profile');
            handleRouteChange();
        });
    }
    startMatch(player1, player2, onGameEnd) {
        const brackets = this.querySelector('#bracket');
        brackets.innerHTML = '';
        const gameContainer = this.querySelector('#game-container');
        this.playeron = true;
        let pongGame = null;
        if (player1.type === 'AI' && player2.type === 'AI') {
            const winner = Math.random() < 0.5 ? player1 : player2;
            let player1Score = 3;
            let player2Score = 0;
            if (winner.name === player2.name) {
                player1Score = 0;
                player2Score = 3;
            }
            return onGameEnd(winner, player1Score, player2Score);
        }
        else if (player2.type === 'AI') {
            pongGame = renderPonTournament(this.addCustom, this.addCustom1, this.addCustom2, player2, player1, (winner, player1Score, player2Score) => {
                onGameEnd(winner, player1Score, player2Score);
            });
        } else {
            pongGame = renderPonTournament(this.addCustom, this.addCustom1, this.addCustom2, player1, player2, (winner, player1Score, player2Score) => { // Callback al terminar el juego
                onGameEnd(winner, player1Score, player2Score);
            });
        }
        this.playeron = false;
        gameContainer.innerHTML = '';
        this.saveTournamentData();
        gameContainer.appendChild(pongGame);
    }
    generateBracketHTML() {
        return this.tournamentData.rounds.map((round, roundIndex) => `
            <div class="round">
                <h3>Ronda ${roundIndex + 1}</h3>
                <div class="matches">
                    ${round.map(match => `
                        <div class="match">
                             <span>${match.player1.name}: ${match.player1_score} vs ${match.player2.name}: ${match.player2_score}</span>
                            ${match.winner ? `<div class="winner">Ganador: ${match.winner.name}</div>` : ''}
                        </div>`).join('')}
                </div>
            </div>`).join('');
    }
}
customElements.define('tournament-view', TournamentView);
export default function renderTournamentApp() { return '<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><tournament-view></tournament-view>'; }

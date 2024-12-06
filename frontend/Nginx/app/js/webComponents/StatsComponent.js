class GameStats extends HTMLElement {
	constructor(){
		super();
		let shadow = this.attachShadow({ mode: 'open' });
		let style = document.createElement('style');
		style.textContent = /*css*/`
			#logstatus {
				background-color: green;
				border-radius: 50%;
				height: 10px;
				width: 10px;
			}
			.nogamehistory {
				color: rgba(160, 215, 160, 0.9);
				font-size: 1.5rem;
				font-family: 'Press Start 2P', cursive;
				text-align: center;
				margin-top: 10%;
			}
			.GameStatsContainer {
				font-family: 'Press Start 2P', cursive;
				font-size: 0.8rem;
				padding: 1rem;
				background-color: #2b3339;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				width: 79vw;
				height: 60vh;
				position: fixed;
				top: 60%;
				transform: translateY(-50%);
				right: 3rem;
				border-radius: 30px;
				box-shadow: 0 0 10px 2px rgba(0,0,0,0.5);
			}
			.GameStats-div {
				color: rgba(160, 215, 160, 0.9);
				margin: 4px;
				justify-content: space-between;
				display: flex;
				padding: 10px;
				width: 100%;
				border-bottom: 1px solid #323c41;
				box-shadow: 0 0 5px 0 rgba(0,0,0,0.3);
				border-radius: 10px;
			}
			.statsContainer {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.chart-container {
				width: 80%;
				height: 200px;
			}
			
	`;
	
	shadow.appendChild(style);
	this.container = document.createElement('div');
	this.container.className = 'GameStatsContainer';
	
	let myDiv = document.createElement('div');
	myDiv.id = 'myDiv';
	myDiv.style.zIndex = '9';
	this.container.appendChild(myDiv);
	
	let refreshButton = document.createElement('button');
	refreshButton.id = 'refreshButton';
	refreshButton.style.zIndex = '10';
	refreshButton.textContent = 'Refresh';
	this.container.appendChild(refreshButton);

	shadow.appendChild(this.container);
	}

	
	
	async connectedCallback(){
		let username = localStorage.getItem('username');
		let token = getCookie('access_token');
		console.log(token);
		try {
			await this.createDummyMatches();
			let response = await fetch(`http://localhost:8000/matches/obtainHistory?username=${username}`,{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
		});
		if (!response.ok){
			throw new Error('Error en la peticion');
		}
		let gamehistory = await response.json();
		console.log(gamehistory);
		this.rendergamehistory(gamehistory);
	}catch(error){
		console.error('Error en la peticion', error);
		this.rendergamehistory(0);
	}
}
async createDummyMatches() {
	const dummyMatches = [
		{
			player1: 'juan-anm',
			player2: 'pepe1',
			player1_score: 3,
			player2_score: 1,
			winner: 'juan-anm',
		},
		{
			player1: 'juan-anm',
			player2: 'pepe2',
			player1_score: 3,
			player2_score: 1,
			winner: 'juan-anm',
		},
		{
			player1: 'juan-anm',
			player2: 'pepe3',
			player1_score: 3,
			player2_score: 1,
			winner: 'juan-anm',
		}
	];
	let username = localStorage.getItem('username');
	for (const match of dummyMatches) {
		try {
			let response = await fetch(`http://localhost:8000/matches/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${getCookie('access_token')}`
				},
				body: JSON.stringify(match)
			});
			console.log(match);

			if (!response.ok) {
				throw new Error();
			}

			let result = await response.json();
			console.log('Match created:', result);
		} catch (error) {
			console.error('Error creating match:', error.detail);
		}
	}
}

rendergamehistory(gamehistory){
		this.container.innerHTML = '';
		console.log(gamehistory.length);
		if(gamehistory.length === 0){
			let nogamehistory = document.createElement('div');
			nogamehistory.className = 'nogamehistory';
			nogamehistory.textContent = 'No hay partidas recientes';
			this.container.appendChild(nogamehistory);
		}else{
			gamehistory.forEach(friend => {
				let friendDiv = document.createElement('div');
				friendDiv.className = 'friend-div';
				let logstatus = document.createElement('div');
				logstatus.id = 'logstatus';
				friendDiv.textContent = friend.name; /*revisar con el back end si el campo se llama name*/ 
				friendDiv.appendChild(logstatus);
				this.container.appendChild(friendDiv);
			});
		}
	}
	disconectedCallback(){}
}

window.customElements.define("gamestats-component", GameStats);
export default GameStats;

function getCookie(name) {
	let cookieArr = document.cookie.split(";");
	for (let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");
		if (name == cookiePair[0].trim()) {
			console.log(cookiePair[1]);
		return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}
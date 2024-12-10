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
				font-size: 2.5rem;
				font-family: 'Press Start 2P', cursive;
				text-align: center;
				text-transform: uppercase;
				justify-content: center;
				height: 100%;
			}
			.table-container {
                width: 100%;
                max-height: 35%; /* Ajusta la altura máxima según sea necesario */
                overflow-y: auto; /* Habilita el scroll vertical */
            }
			.GameStatsContainer {
				font-family: 'Press Start 2P', cursive;
				font-size: 0.8rem;
				padding: 1rem;
				background-color: #2b3339;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				width: 79vw;
				height: 70vh;
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
			.stats-table{
				width: 100%;
				color : #e67e80;
				text-align: center;
			}
			.stats-table th {
                background-color: #1d252a;
                color: rgba(160, 215, 160, 0.9);
                padding: 10px;
                border-bottom: 1px solid #323c41;
                position: sticky; /* Hace que el encabezado sea pegajoso */
                top: 0; /* Posición del encabezado pegajoso */
                z-index: 1; /* Asegura que el encabezado esté por encima del contenido */
            }	
			th{
				background-color: #1d252a;
				color: rgba(160, 215, 160, 0.9);
				padding: 10px;
				border-bottom: 1px solid #323c41;
				position: sticky;
			}
			tr:nth-child(even) {
				background-color: #323c41;
				
			}
			tr:nth-child(odd) {
				background-color: #2b3339;
			}
			.pie-chart-container {
				position: absolute;
				top: 20px;
				left: 20px;
				width: 30%; 
				height: 60%; 
				background-color: #2b3339;
				border-radius: 10px; 
				box-shadow: 0 0 10px 2px rgba(0,0,0,0.5); 
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				overflow: hidden;
			}
			.pie-chart-container h1 {
				color: rgba(160, 215, 160, 0.9);
				font-family: 'Press Start 2P', cursive;
				font-size: 1.5rem;
				text-align: center;
				margin-top: 20px;
			}
			#pieChartDiv {
				width: 90%;
				height: 90%;
				margin-bottom: 50px;
				}
	`;
	
	shadow.appendChild(style);
	this.container = document.createElement('div');
	this.container.className = 'GameStatsContainer';
	
	const myDiv = document.createElement('div');
	myDiv.id = 'myDiv';
	myDiv.style.width = '100%';
	myDiv.style.height = '400px';
	this.container.appendChild(myDiv);

	shadow.appendChild(this.container);
	}

	
	
	async connectedCallback(){
		let username = localStorage.getItem('username');
		let token = getCookie('access_token');
		console.log(token);
		try {
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
			
		this.rendergamehistory(gamehistory);
		this.renderPieChart(gamehistory);
	}catch(error){
		console.error('Error en la peticion', error);
	}
}

rendergamehistory(gamehistory){
	const tbody = document.createElement('tbody');
	tbody.innerHTML = ''; // Clear previous data

	if (gamehistory.length === 0) {
		let nogamehistory = document.createElement('div');
		nogamehistory.className = 'nogamehistory';
		nogamehistory.textContent = 'No hay partidas recientes';
		this.container.appendChild(nogamehistory);
		return;
	}

	// Create table container
	const tableContainer = document.createElement('div');
	tableContainer.className = 'table-container';

	// Create table structure
	const table = document.createElement('table');
	table.className = 'stats-table';

	const thead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	const headers = ['Date', 'Player 1', 'Score', 'Player 2', 'Score', 'Winner'];
	headers.forEach(headerText => {
		const th = document.createElement('th');
		th.textContent = headerText;
		headerRow.appendChild(th);
	});
	thead.appendChild(headerRow);
	table.appendChild(thead);

	tbody.className = 'stats-tbody';
	table.appendChild(tbody);

	tableContainer.appendChild(table);
	this.container.appendChild(tableContainer);

	gamehistory.forEach(match => {
		const row = document.createElement('tr');

		const dateCell = document.createElement('td');
		const date = new Date(match.date);
		dateCell.innerHTML = `${date.toLocaleDateString()}`;
		row.appendChild(dateCell);

		const player1Cell = document.createElement('td');
		player1Cell.textContent = match.player1_username;
		row.appendChild(player1Cell);

		const player1ScoreCell = document.createElement('td');
		player1ScoreCell.textContent = match.player1_score;
		row.appendChild(player1ScoreCell);

		const player2Cell = document.createElement('td');
		player2Cell.textContent = match.player2_username;
		row.appendChild(player2Cell);

		const player2ScoreCell = document.createElement('td');
		player2ScoreCell.textContent = match.player2_score;
		row.appendChild(player2ScoreCell);

		const winnerCell = document.createElement('td');
		winnerCell.textContent = match.winner_username;
		row.appendChild(winnerCell);

		tbody.appendChild(row);
	});
	}

	renderPieChart(gamehistory) {

		if (gamehistory.length === 0) {
			return;
		}

        const wins = gamehistory.filter(match => match.winner_username === localStorage.getItem("username")).length;
        const losses = gamehistory.length - wins;
        // Create a div for the pie chart
        const pieChartContainer = document.createElement('div');
        pieChartContainer.className = 'pie-chart-container';
        const pieChartitle= document.createElement('h1');
		pieChartitle.textContent = 'Wins vs Losses %';
		pieChartitle.style.textAlign = 'center';
		pieChartitle.style.color = 'rgba(160, 215, 160, 0.9)';
		pieChartitle.style.fontFamily = 'Press Start 2P';
		pieChartContainer.appendChild(pieChartitle);
        const pieChartDiv = document.createElement('div');
        pieChartDiv.id = 'pieChartDiv';
        pieChartContainer.appendChild(pieChartDiv);
        this.container.appendChild(pieChartContainer);

        const data = [{
            values: [wins, losses],
            labels: ['Wins', 'Losses'],
			textinfo: 'label+percent',
            type: 'pie',
			textposition: "outside",
			automargin: true,
			marker: {
                colors: ['#4caf50', '#f44336'] // Green for wins, Red for losses
            }
        }];

 
        const layout = {
            paper_bgcolor: '#2b3339',
            font: {
                color: 'rgba(160, 215, 160, 0.9)'
            },
			width: '50%',
            height: '50%',
            showlegend: false,
            margin: {
                l: 0,
                r: 200,
                b: 0,
                t: 30,
                pad: 0
            }
        };

        Plotly.newPlot(pieChartDiv, data, layout, {responsive: true});
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

// https://plotly.com/javascript/bar-charts/
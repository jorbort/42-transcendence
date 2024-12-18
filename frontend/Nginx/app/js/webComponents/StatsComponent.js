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
			//.GameStatsContainer:hover {
			//	height: 60vh;
			//	width: 25vw;
			//	box-shadow: 0 0 15px 3px rgba(0,15,5,0.8);
			//	transition: all 0.5s ease-in-out;
			//}
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
			// .GameStats-div:hover {
			//	color: rgba(200, 225, 200, 0.7);
			//	box-shadow: 0 0 8px 3px rgba(0, 20, 5, 0.8);
			//	transform: translatey(-1px);
			//	transition: all 0.1s ease-in-out;
			// }
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
	shadow.appendChild(this.container);
	}

	async connectedCallback() {
		let username = localStorage.getItem('username');
		let token = getCookie('access_token');
		console.log(token);
		try {
			let response = await fetch(`http://localhost:8000/matches/obtainHistory?username=${username}`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
			});
			if (!response.ok) {
		throw new Error('Error en la peticion');
			}
			let stats = await response.json();
			console.log(stats);
			this.renderStats(stats);
		} catch (error) {
			console.error(error);
		}
	}

	renderStats(stats) {
        this.container.innerHTML = '';

        // Create stats container
        let statsContainer = document.createElement('div');
        statsContainer.className = 'statsContainer';

        // Check if there are wins and losses
        if (stats.wins === 0 && stats.losses === 0) {
            let noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No statistics available';
            statsContainer.appendChild(noDataMessage);
        } else {
            // Create chart container
            let chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            let canvas = document.createElement('canvas');
            canvas.id = 'statsChart';
            chartContainer.appendChild(canvas);
            statsContainer.appendChild(chartContainer);

            // Render chart
            this.renderChart(stats.wins, stats.losses);
        }

        // Check if there are matches
        if (stats.matches && stats.matches.length > 0) {
            // Create matches list
            let matchesList = document.createElement('div');
            matchesList.className = 'matches-list';
            stats.matches.forEach(match => {
                let matchDiv = document.createElement('div');
                matchDiv.className = 'GameStats-div';
                matchDiv.textContent = `${match.opponent}: ${match.result}`;
                matchesList.appendChild(matchDiv);
            });
            statsContainer.appendChild(matchesList);
        } else {
            let noMatchesMessage = document.createElement('p');
            noMatchesMessage.textContent = 'No matches available';
            statsContainer.appendChild(noMatchesMessage);
        }

        this.container.appendChild(statsContainer);
    }
	renderChart(wins, losses) {
		let ctx = this.shadowRoot.getElementById('statsChart').getContext('2d');
		new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Wins', 'Losses'],
			datasets: [{
				data: [wins, losses],
				backgroundColor: ['#4caf50', '#f44336']
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});
	}

	disconnectedCallback() {}
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
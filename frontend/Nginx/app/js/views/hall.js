import { getTournaments, connectToMetaMask } from './blockchain.js';

class Hall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        await connectToMetaMask();
        const tournaments = await getTournaments();

        this.shadowRoot.innerHTML = `
            <style>
                #nothing {
                    font-family: 'Press Start 2P', cursive;
                    font-size: 3rem;
                    color: #ffffff;
                    text-align: center;
                    margin-top: 50px;
                    text-shadow: 2px 2px 4px #000000, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
                    padding: 20px;
                    border-radius: 10px;
                    display: inline-block;
                    animation: blink 1s infinite alternate;
                }
                
                @keyframes blink {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0.5;
                    }
                }
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: white;
                    font-family: Arial, sans-serif;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                    max-height: 80vh;
                    width: 80%;
                    padding: 1rem;
					padding-bottom: 5rem;
                }
				.container::-webkit-scrollbar {
    				display: none;
				}
                .card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
					align-items: center;
                    padding: 1rem;
                    margin: 0.5rem;
                    width: 100%;
                    max-width: 600px;
                    background-color: #2c2c2c;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    color: #fff;
                    transition: transform 0.2s;
                }
                .card:hover {
                    transform: translateY(-5px);
                }
                .card-title {
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                .card-info {
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
            </style>
            <div class="container">
                ${tournaments.length === 0
                ? `<h1 id="nothing">Nothing to see here!</h1>`
                : tournaments
                    .slice()
                    .reverse()
                    .map(
                        (tournament) => `
                        <div class="card">
                            <div class="card-title">🏆 ${tournament.name}</div>
                            <div class="card-info">
                                <p><strong>Winner:</strong> ${tournament.winner}</p>
                                <p><strong>Date:</strong> ${tournament.date.slice(0, 10)}</p>
                                <p><strong>Time:</strong> ${tournament.date.slice(11) || "top secret"}</p>
                            </div>
                        </div>
                    `
                    )
                    .join("")}
            </div>
        `;
    }

    disconnectedCallback() { }
}

customElements.define("hall-hall", Hall);

export default function renderHall() {
    return "<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><hall-hall></hall-hall>";
}

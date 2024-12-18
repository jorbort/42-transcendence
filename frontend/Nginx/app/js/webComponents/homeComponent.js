import {MarioComponent} from './marioComponent.js';

export default class HomeComponent extends HTMLElement{
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		style.textContent = /*css*/`
			:host{
				font-family: "Press Start 2P", cursive;
				color: rgba(160, 215, 160, 0.9);
				display: flex;
				align-items: center;
				justify-content: center;
				height: 70vh;
				width: 55vw;
				position: absolute;
                top: 55%;
                left: 45%;
                transform: translate(-50%, -50%);
				outline: none;
				box-shadow: rgba(30, 30, 30, 0.9) 2px 3px 10px 0px;
				border-radius: 20px;
				background-color : rgb(43,51,57);
			}
			.imgContainer{
				width: 35%;
				height: 65%;
				display: flex;
				justify-content: center;
				align-items:center;
			}
			img{
				border-radius: 50%;
				width: 16em;
				height: 16em;
				box-shadow:rgba(30, 30, 30, 0.9) 2px 3px  10px 5px;
			}
			.home{
				display: grid;
				grid-gap: 10px;
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 1fr 1fr;
				height: 100%;
				width: 100%;
				align-self: center;
				justify-self: center;
			}
			.info{
				grid-column-start: span 2;
				grid-row-start: 1;
				display: flex;
				justify-content: space-around;
				align-items: center;
			}
			.mario-tag-container {
                position: relative;
            }
            .user-info mario-tag {
                position: absolute;
                top: 1.6em;
                right:10em;
            }
			.user-info{
				text-align: center;
				box-shadow:rgba(30, 30, 30, 0.7) 1px 2px  8px 5px;
				height: 60%;
				width: 40%;
				border-radius: 25px;
				display: flex;
				align-items: center;
				justify-content:center;
			}
			.user-info h2:hover{
				transform: translatey(-10px);
				transition: 0.1s ease-in-out;
			}
			ul{
				list-style: none;
				padding: 2px
			}
			.last-game{
				text-align: center;
				box-shadow:rgba(30, 30, 30, 0.7) 1px 2px  8px 5px;
				height: 90%;
				width: 90%;
				border-radius: 25px;
				align-self: center;
				justify-self: center;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.win-rate{
				text-align: center;
				box-shadow:rgba(30, 30, 30, 0.7) 1px 2px  8px 5px;
				height: 90%;
				width: 90%;
				border-radius: 25px;
				align-self: center;
				justify-self: center;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		`;
		shadow.appendChild(style);
		const container = document.createElement('div');
		container.className = 'home'
		container.innerHTML = /*html*/`
				<div class="info">
					<div class="imgContainer">
						<img src="${localStorage.getItem('user_img')}"></img>
					</div>
					<div class="user-info">
						
						<h2>${localStorage.getItem('username')}</h2>
						<mario-tag type="module"></mario-tag>
					</div>
				</div>
				<div class="last-game">
					<p>Last game</p>
				</div>
				<div class="win-rate">
					<p>Win rate %</p>
				</div>
		`;
		shadow.appendChild(container);
	}
	connectedCallback(){}
	disconnectedCallback(){}
}
window.customElements.define('home-component', HomeComponent);
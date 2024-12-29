import { userStatusService } from "./UserStatusService.js";

export default class headerNavBar extends HTMLElement{
	constructor(){
		super();
		this.shadow = this.attachShadow({mode: 'closed'});
		const style = document.createElement('style');
		style.textContent = /*css*/`
			:host{
				margin-bottom: 1000px;
			}
			.gradient-text {
				font-family: "Press Start 2P", cursive;
				margin-left: 2rem;
				font-size: 3rem;
				background:#e67e80;
				background-size: 200% 200%;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				animation: gradient-animation 5s ease infinite;
			}
			.gradient-text:hover{
				font-size: 1.7rem;
				transition: all 0.5s ease-in-out;
			}
			#spantitle{
				font-size: 1.5rem;
			}
			#spantitle:hover{
				font-size: 1.7rem;
				transition: all 0.5s ease-in-out;
			}
			.headerNavBar{
				position: relative;
				height: 12vh;
				width: 100vw;
				background-color: rgba(43,51,57);
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow:rgba(30, 30, 30, 0.9) 2px 3px 10px 0px;
				border-radius: 5px 5px 5px 5px;
				border : none;
			}
			.headerNavBar:hover{
				transition: all 0.5s ease-in-out;
				transform: translatey(3px);
				box-shadow:rgba(35, 35, 35, 0.9) 3px 4px 12px 2px;
			}
			.icon-Div{
				display: flex;
				align-items: center;
				justify-content: space-around;
				width: 15%;
				height: 100%;
				color : rgba(160, 215, 160, 0.9);
				
			}
			.icon:hover{
				color: rgba(200, 225, 200, 0.7);
				transform: translateY(-2px);
			}
			.icon{
				width: 20%;
				height:30%;
				display: flex;
				justify-content: center;
				align-items:center;
				flex-grow: 1;
			}
			.pic-container{
				width: 25%;
				height: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius:50%;
			}
			img{
				width: 4em;
				height: 4em;
				border-radius:50%;
				box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.9);
			}
			img:hover{
				transform: translateY(-2px)
			}
			.tooltip {
				width: 5rem;
				height: 8px;
				background: #2b3339;
				padding: 0.5em;
				text-align: center;
				position: absolute;
				top: 60px;
				left: 0;
				opacity: 0;
				visibility: hidden;
				transform-origin: center top;
				box-shadow: 0px 0px 20px 3px rgba(0, 20, 5, 0.8);
				transition: opacity 0.3s ease-in-out;
				display: flex;
				align-content:center;
				justify-content:center;
			}
			.tooltip p {
				margin: 0;
				color: #ffffff;
				font-size: 0.6rem;
				font-family: "Press Start 2P", cursive;
				align-self: center;
				justify-self: center;
			}
			.icon:hover .tooltip {
				top: 100px;
				left: 40px;
				opacity: 1;
				visibility: visible;
				animation: goPopup 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
			}

			.icon:hover .tooltip p {
				animation: bounce 2s ease-in-out infinite;
			}

			@keyframes goPopup {
				0% {
					transform: translateY(0) scaleY(0);
					opacity: 0;
				}
				50% {
					transform: translateY(-50%) scaleY(1.2);
					opacity: 1;
				}
				100% {
					transform: translateY(-100%) scaleY(1);
					border-radius: 8px;
					opacity: 1;
					height: 40px;
				}
			}
			@keyframes bounce {
				0%,
				20%,
				50%,
				80%,
				100% {
					transform: translateY(0);
				}
				40% {
					transform: translateY(-3px);
				}
				60% {
					transform: translateY(-2px);
				}
			}
			loading {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.loading-box {
				width: 250px;
				height: 80px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				position: relative;
			}

			.color {
				background-color: rgba(160, 215, 160, 0.9);
			}
			.WH {
				width: 10px;
				height: 50px;
				position: absolute;
				box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
			}

			.l1 {
				left: 0;
				animation: l1 4s infinite linear;
			}
			.l2 {
				right: 0;
				animation: l2 4s infinite linear;
			}
			.ball {
				width: 15px;
				height: 15px;
				border-radius: 50%;
				position: absolute;
				animation: ball 4s infinite linear;
			}
			@keyframes l1 {
				0% {
					top: 0%;
				}
				10% {
					top: -20%;
				}
				20% {
					top: 0%;
				}
				30% {
					top: 40%;
				}
				40% {
					top: 0%;
				}
				50% {
					top: 30%;
				}
				60% {
					top: 40%;
				}
				70% {
					top: 60%;
				}
				80% {
					top: -10%;
				}
				90% {
					top: 10%;
				}
				100% {
					top: 0%;
				}
				}
			@keyframes l2 {
				0% {
					bottom: 0%;
				}
				10% {
					bottom: -20%;
				}
				20% {
					bottom: 40%;
				}
				30% {
					bottom: 60%;
				}
				40% {
					bottom: 20%;
				}
				50% {
					bottom: 30%;
				}
				60% {
					bottom: 40%;
				}
				70% {
					bottom: 60%;
				}
				80% {
					bottom: -10%;
				}
				90% {
					bottom: 10%;
				}
				100% {
					bottom: 0%;
				}
			}
			@keyframes ball {
				0% {
					top: 80%;
					left: 96%;
				}
				10% {
					top: 10%;
					left: 3%;
				}
				20% {
					top: 10%;
					left: 90%;
				}
				30% {
					top: 60%;
					left: 3%;
				}
				40% {
					top: 10%;
					left: 90%;
				}
				50% {
					top: 50%;
					left: 3%;
				}
				60% {
					top: 10%;
					left: 90%;
				}
				70% {
					top: 93%;
					left: 3%;
				}
				80% {
					top: 83%;
					left: 90%;
				}
				90% {
					top: 10%;
					left: 3%;
				}
				100% {
					top: 80%;
					left: 90%;
				}
			}
		`;
		this.shadow.appendChild(style);
	}
	render(){
		let content = document.createElement('div');
		content.className = 'headerNavBar';
		content.innerHTML = /*html*/`
		<div class="gradient-text">
			TRANS<span id="spantitle">CENDENCE</span>		
		</div>
		<div class="loading">
  			<div class="loading-box">
    			<div class="WH color l1"></div>
    			<div class="ball color"></div>
    			<div class="WH color l2"></div>
  			</div>
		</div>
		<div class="icon-Div">
			<div class="pic-container">
				<img src="${localStorage.getItem('user_img')}" alt="intra profile pic">
			</div>
			<div class="icon" id="logOut">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentcolor" style="height: 3rem; width: rem;" >
					<path d="M5 3h16v4h-2V5H5v14h14v-2h2v4H3V3h2zm16 8h-2V9h-2V7h-2v2h2v2H7v2h10v2h-2v2h2v-2h2v-2h2v-2z"/>
				</svg>
				<div class="tooltip">
    				<p>Log Out</p>
				</div>
			</div>
		</div>`;
		this.shadow.appendChild(content);
	}
	connectedCallback() {
		this.render();
		const logOut = this.shadow.getElementById('logOut');
		logOut.addEventListener('click', () => {
			localStorage.clear();
			sessionStorage.clear();
			const cookies = [
				'_intra_42_session_production',
				'access_token',
				'csrftoken',
				'refresh_token',
				'sessionid'
			];
			cookies.forEach(cookie => {
				document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.intra.42.fr`;
				document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`;
			});
			userStatusService.disconnect();
			window.location.href = '/';
		});
	}
	disconnectedCallback(){}
}
customElements.define('header-nav-bar', headerNavBar);
import {handleRouteChange}  from '../mainScript.js';
import { userStatusService } from "./UserStatusService.js";

export default class OTPComponent extends HTMLElement{
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		style.textContent = /*css*/`
		:host{
			font-family: 'Press Start 2P', cursive;
		}
		#error-otp{
			font-family: 'Press Start 2P', cursive;
		}
		.brutalist-container {
			position: relative;
			width: 250px;
			font-family: monospace;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
		}
		.brutalist-input {
			width: 100%;
			padding: 15px;
			font-size: 18px;
			font-weight: bold;
			font-family: 'Press Start 2P', cursive;
			color: #e67e80;
			background-color: #fff;
			border: 4px solid #000;
			position: relative;
			overflow: hidden;
			border-radius: 0;
			outline: none;
			transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
			box-shadow: 5px 5px 0 #000, 10px 10px 0 #a7c080;
		}
		@keyframes glitch {
			0% {
				transform: translate(0);
			}
			20% {
				transform: translate(-2px, 2px);
			}
			40% {
				transform: translate(-2px, -2px);
			}
			60% {
				transform: translate(2px, 2px);
			}
			80% {
				transform: translate(2px, -2px);
			}
			100% {
				transform: translate(0);
			}
		}
		.brutalist-input:focus {
			animation: focus-pulse 4s cubic-bezier(0.25, 0.8, 0.25, 1) infinite,
				glitch 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
		}
		.brutalist-input:focus::after {
			content: "";
			position: absolute;
			top: -2px;
			left: -2px;
			right: -2px;
			bottom: -2px;
			background: white;
			z-index: -1;
		}
		.brutalist-input:focus::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: black;
			z-index: -2;
			clip-path: inset(0 100% 0 0);
			animation: glitch-slice 4s steps(2, end) infinite;
		}
		@keyframes glitch-slice {
			0% {
				clip-path: inset(0 100% 0 0);
			}
			10% {
				clip-path: inset(0 5% 0 0);
			}
			20% {
				clip-path: inset(0 80% 0 0);
			}
			30% {
				clip-path: inset(0 10% 0 0);
			}
			40% {
				clip-path: inset(0 50% 0 0);
			}
			50% {
				clip-path: inset(0 30% 0 0);
			}
			60% {
				clip-path: inset(0 70% 0 0);
			}
			70% {
				clip-path: inset(0 15% 0 0);
			}
			80% {
				clip-path: inset(0 90% 0 0);
			}
			90% {
				clip-path: inset(0 5% 0 0);
			}
			100% {
				clip-path: inset(0 100% 0 0);
			}
		}
		.brutalist-label {
			position: absolute;
			font-family: 'Press Start 2P', cursive;
			text-align: center;
			left: -3px;
			top: -35px;
			font-size: 0.7em;
			font-weight: bold;
			color: #e67e80;
			background-color: #000;
			padding: 5px 10px;
			transform: rotate(-1deg);
			z-index: 1;
			transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		}
		.brutalist-input:focus + .brutalist-label {
			transform: rotate(0deg) scale(1.05);
			background-color: #a7c080;
		}
		.smooth-type {
			position: relative;
			overflow: hidden;
		}
		.smooth-type::before {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: linear-gradient(90deg, #e67e80 0%, rgba(255, 255, 255, 0) 100%);
			z-index: 1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}
		.smooth-type:focus::before {
			opacity: 1;
			animation: type-gradient 2s linear infinite;
		}
		@keyframes type-gradient {
			0% {
				background-position: 300px 0;
			}
			100% {
				background-position: 0 0;
			}
		}
		.brutalist-input::placeholder {
			color: #e67e80;
			transition: color 0.3s ease;
		}
		.brutalist-input:focus::placeholder {
			color: rgba(230, 126, 128,0.5);
		}
		.brutalist-input:focus {
			animation: focus-pulse 3s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
		}
		@keyframes focus-pulse {
			0%,
			100% {
				border-color: #000;
			}
			50% {
				border-color: #a7c080;
			}
		}
		.flip-card__btn:active {
			box-shadow: 0px 0px #a7c080;
			transform: translate(3px, 3px);
		} 
		.flip-card__btn {
			margin: 10px 0 10px 0;
			width: 9rem;
			height: 3.5rem;
			border-radius: 5px;
			border: 2px solid #a7c080;
			background-color: #2b3339;
			box-shadow: 4px 4px #a7c080;
			font-weight: 600;
			color: #e67e80;
			cursor: pointer;
			font-size: 0.6rem;
			font-family: "Press Start 2P";
		}
		#testing{
			width: 100vw;
			height: 65vh;
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			flex-direction: column;
		}
		`;
		shadow.appendChild(style);
		let container = document.createElement('div');
		container.innerHTML = /*html*/`
		<div id="testing">
		<div class="brutalist-container">
			<input
				placeholder="Enter OTP"
				class="brutalist-input smooth-type"
				type="text" maxlength="6" minlength="6" required
			/>
			<label class="brutalist-label">Enter One Time Password</label>
			<button class="flip-card__btn" type="submit">Submit!</button>
			<div id="error-otp" style="color: red;"></div>
		</div>
		</div>

		`;
		shadow.appendChild(container);
		this.container = container;
	}
	connectedCallback(){
		this.container.querySelector('button').addEventListener('click', this.handleSubmit.bind(this));
	}

	disconnectedCallback(){
		this.container.querySelector('button').removeEventListener('click', this.handleSubmit.bind(this));
	}

	async handleSubmit(event){
		event.preventDefault();
		let user = localStorage.getItem('username');
		let pass = localStorage.getItem('pass');
		let otpValue = this.container.querySelector('.brutalist-input').value;
		let error = this.container.querySelector('#error-otp');
		error.innerHTML = '';
		const formData = {
			otp: otpValue,
			username: user,
			password: pass,
		};
		const jsonString = JSON.stringify(formData);
		try{
			const response = await fetch('https://localhost:3042/users/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonString
            });
			if (response.ok){
				const responseData = await response.json();
                const accessToken = responseData.access_token;
                const refreshToken = responseData.refresh_token;
				const user_img = responseData.avatar;
				
				if (user_img){
					localStorage.setItem('user_img', user_img);
				}else {
					localStorage.setItem('user_img', 'images/userPlaceholderImg.webp')
				}
				localStorage.removeItem('pass');
                document.cookie = `access_token=${accessToken}; path=/`;
                document.cookie = `refresh_token=${refreshToken}; path=/`;
                window.location.pathname = '/Profile';
				handleRouteChange();
			}else{
				const errorData = await response.json();
				error.innerHTML = "Invalid OTP";
				
			}
		}catch(error){
		}
	}
}

window.customElements.define("otp-tag", OTPComponent);
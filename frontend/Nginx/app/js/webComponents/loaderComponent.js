class LoaderComponent extends HTMLElement{
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		const style = document.createElement('style');
		style.textContent = /*css*/`
		:host{
			font-family: 'Press Start 2P', cursive;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
		}
		.glitch {
			position: relative;
			font-size: 3em;
			font-weight: 700;
			line-height: 1.2;
			color: #1e1e2e; /* Dark purplish background */
			letter-spacing: 5px;
			z-index: 1;
			animation: shift 1s ease-in-out infinite alternate;
		}

		.glitch:before,
		.glitch:after {
			display: block;
			content: attr(data-glitch);
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0.8;	
		}

		.glitch:before {
			animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
			color:rgb(132, 94, 207);
			z-index: -1;
		}

		.glitch:after {
			animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
			color: #f4e06d;
			z-index: -2;
		}

		@keyframes glitch {
			0% {
				transform: translate(0);
			}

			20% {
				transform: translate(-3px, 3px);
			}

			40% {
				transform: translate(-3px, -3px);
			}

			60% {
				transform: translate(3px, 3px);
			}

			80% {
				transform: translate(3px, -3px);
			}

			to {
				transform: translate(0);
			}
		}

		@keyframes shift {
			0%, 40%, 44%, 58%, 61%, 65%, 69%, 73%, 100% {
				transform: skewX(0deg);
			}

			41% {
				transform: skewX(10deg);
			}

			42% {
				transform: skewX(-10deg);
			}

			59% {
				transform: skewX(40deg) skewY(10deg);
			}

			60% {
				transform: skewX(-40deg) skewY(-10deg);
			}

			63% {
				transform: skewX(10deg) skewY(-5deg);
			}

			70% {
				transform: skewX(-50deg) skewY(-20deg);
			}

			71% {
				transform: skewX(10deg) skewY(-10deg);
			}
		}

		`;
		this.shadowRoot.appendChild(style);
		const content = document.createElement('div');
		content.innerHTML = /*html*/`
		<div class="loader">
   			<div data-glitch="Loading..." class="glitch">Loading...</div>
		</div>
		`;
		this.shadowRoot.appendChild(content);
	}
	connectedCallback(){
	}
	disconnectedCallback(){
	}
}

window.customElements.define('loader-component', LoaderComponent);

export {LoaderComponent};
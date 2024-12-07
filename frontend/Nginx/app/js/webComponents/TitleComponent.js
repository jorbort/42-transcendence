export default class TitleComponent extends HTMLElement{
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		style.textContent = /*css*/`*,
		:host{
			margin-top: 10px;
			margin-bottom: 0px;
			padding: 0px;
		}

		*::before,
		*::after {
		  box-sizing: border-box;
		}
		body {
		  min-height: 100vh;
		  font-family: 'Press Start 2P', sans-serif;
		  font-weight: 300;
		  font-size: 1rem;
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		  overflow: hidden;
		  background-color: #eff8e2;
		}
		.content {
		  display: flex;
		  align-content: center;
		  justify-content: center;
		}	
		.text_shadows {
		  text-shadow: 3px 3px 0 #f49b90, 6px 6px 0 #f28b7d,
			9px 9px #f07a6a, 12px 12px 0 #ee6352;
		  font-family: 'Press Start 2P', sans-serif;
		  font-weight: 400;
		  text-transform: uppercase;
		  font-size: calc(1.2rem + 2vw);
		  text-align: center;
		  margin-top: 2em;
		  color: #f6aca2;
		  //color: transparent;
		  //background-color: white;
		  //background-clip: text;
		  animation: shadows 1.2s ease-in infinite, move 1.2s ease-in infinite;
		  letter-spacing: 0.4rem;
		}
		@keyframes shadows {
		  0% {
			text-shadow: none;
		  }
		  10% {
			text-shadow: 3px 3px 0 #f49b90;
		  }
		  20% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d;
		  }
		  30% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d, 9px 9px #f07a6a;
		  }
		  40% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d, 9px 9px #f07a6a,
			  12px 12px 0 #ee6352;
		  }
		  50% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d, 9px 9px #f07a6a,
			  12px 12px 0 #ee6352;
		  }
		  60% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d, 9px 9px #f07a6a,
			  12px 12px 0 #ee6352;
		  }
		  70% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d, 9px 9px #f07a6a;
		  }
		  80% {
			text-shadow: 3px 3px 0 #f49b90,
			  6px 6px 0 #f28b7d;
		  }
		  90% {
			text-shadow: 3px 3px 0 #f49b90;
		  }
		  100% {
			text-shadow: none;
		  }
		}
		@keyframes move {
		  0% {
			transform: translate(0px, 0px);
		  }
		  40% {
			transform: translate(-12px, -12px);
		  }
		  50% {
			transform: translate(-12px, -12px);
		  }
		  60% {
			transform: translate(-12px, -12px);
		  }
		  100% {
			transform: translate(0px, 0px);
		  }
		}`;
		shadow.appendChild(style);
		let container = document.createElement('div');
		container.innerHTML = /*html*/`<div class="content">
		<p class="text_shadows">Transcendance</p>
	  </div>`;
		shadow.appendChild(container);
	}
	connectedCallback(){

	}	
	disconectedCallback(){

	}
}

window.customElements.define("title-tag", TitleComponent);
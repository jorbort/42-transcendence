import { getCookie } from '../webComponents/friendsListComponent.js';


const	TWO_MEGABYTES = 2*1024*1024;

class profileconfig extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		style.textContent = /*css*/`
		#testing{
			width: 100vw;
			height: 65vh;
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			flex-direction: column;
		}
		:host{
			top: 50%;
			left:50%;
			transform: translate(-50%, -50%);
			font-family: "Press Start 2P", cursive;
			font-size: 0.6rem;
			margin-bottom: 100px;
			padding: 0px;
		}
		svg{
			height: 2.5em;
			width: 2.5em;
		}
		.wrapper {
			--input-focus: rgba(60, 69, 75,1);
			--font-color: #e67e80;
			--font-color-sub: #A0D7A0;
			--bg-color: #2b3339;
			--bg-color-alt: #0000;
			--main-color: #A0D7A0;
		}
		a{
			text-decoration: none;
			color: var(--font-color);
			justify-content: center;
			align-content: center;
			justify-content: center;
		}
		#intra-button{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			gap: 5px;
			width: 9rem;
			height: 3.5rem;
			color: #e67e80;
			padding: 0.3rem;
		}
		.switch {
			transform: translateY(-200px);
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 30px;
			width: 50px;
			height: 20px;
		}
		.card-side::before {
			position: absolute;
			content: 'Log in';
			left: -70px;
			top: 0;
			width: 100px;
			text-decoration: underline;
			color: var(--font-color);
			font-weight: 600;
		}
		.card-side::after {
			position: absolute;
			content: 'Sign up';
			left: 70px;
			top: 0;
			width: 100px;
			text-decoration: none;
			color: var(--font-color);
			font-weight: 600;
		}
		.toggle {
			opacity: 0;
			width: 0;
			height: 0;
		}
		.slider {
			box-sizing: border-box;
			border-radius: 5px;
			border: 2px solid var(--main-color);
			box-shadow: 4px 4px var(--main-color);
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--bg-color);
			transition: 0.3s;
		}
		.slider:before {
			box-sizing: border-box;
			position: absolute;
			content: "";
			height: 20px;
			width: 20px;
			border: 2px solid var(--main-color);
			border-radius: 5px;
			left: -2px;
			bottom: 2px;
			background-color: var(--bg-color);
			box-shadow: 0 3px 0 var(--main-color);
			transition: 0.3s;
		}
		.toggle:checked + .slider {
			background-color: var(--input-focus);
		}
		.toggle:checked + .slider:before {
			transform: translateX(30px);
		}
		.toggle:checked ~ .card-side:before {
			text-decoration: none;
		}
		.toggle:checked ~ .card-side:after {
			text-decoration: underline;
		}
		.flip-card__inner {
			width: 300px;
			height: 350px;
			position: relative;
			background-color: transparent;
			perspective: 1000px;
			text-align: center;
			transition: transform 0.8s;
			transform-style: preserve-3d;
		}  
		.toggle:checked ~ .flip-card__inner {
			transform: rotateY(180deg);
		}		  
		.toggle:checked ~ .flip-card__front {
			box-shadow: none;
		}
		.flip-card__front, .flip-card__back {
			padding: 20px;
			position: absolute;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-content: center;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
			background: var(--bg-color);
			gap: 20px;
			border-radius: 5px;
			border: 2px solid var(--main-color);
			box-shadow: 4px 4px var(--main-color);
		}  
		.flip-card__back {
			width: 100%;
			transform: rotateY(180deg);
		}
		.flip-card__form {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 15px;
		}
		.title {
			margin: 20px 0 20px 0;
			font-size: 25px;
			font-weight: 900;
			text-align: center;
			color: var(--main-color);
		}
		.flip-card__input {
			width: 250px;
			height: 40px;
			border-radius: 5px;
			border: 2px solid var(--main-color);
			background-color: var(--bg-color);
			box-shadow: 4px 4px var(--main-color);
			font-size: 15px;
			font-weight: 600;
			color: var(--font-color);
			padding: 5px 10px;
			outline: none;
			font-family: "Press Start 2p";
		}
		.flip-card__input::placeholder {
			color: var(--font-color);
			opacity: 0.8;
		} 
		.flip-card__input:focus {
			border: 2px solid var(--input-focus);
		}
		.flip-card__btn:active, .button-confirm:active {
			box-shadow: 0px 0px var(--main-color);
			transform: translate(3px, 3px);
		} 
		.flip-card__btn {
			margin: 10px 0 10px 0;
			width: 9rem;
			height: 3.5rem;
			border-radius: 5px;
			align-self: center;
			border: 2px solid var(--main-color);
			background-color: var(--bg-color);
			box-shadow: 4px 4px var(--main-color);
			font-weight: 600;
			color: var(--font-color);
			cursor: pointer;
			font-size: 0.6rem;
			font-family: "Press Start 2P";
		} 
        /* Añadir estos estilos para que el texto de los label se vea encima de los campos */
        .flip-card__form .form-label {
            display: block;
            margin-bottom: 5px;
            color: var(--font-color);
            font-weight: bold;
            text-align: left;
        }

        .flip-card__input {
            width: 250px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            font-size: 15px;
            font-weight: 600;
            color: var(--font-color);
            padding: 5px 10px;
            outline: none;
            font-family: "Press Start 2p";
            margin-top: 5px; /* Espacio entre el label y el input */
        }
        #textconf{
            margin-bottom: 1em;
            color: #e67e80;
        }
		#imageUpload {
			display: none;
		}

		.upload-icon {
			width: 50px;
			height: 50px;
			cursor: pointer;
			transition: transform 0.2s ease;
		}

		.upload-icon:hover {
			transform: scale(1.1);
		}

		.upload-icon:active {
			transform: scale(0.9);
		}
		.imgContainer {
			position: relative;
			width: 150px;
			height: 150px;
			margin: auto;
		}

		#profileImage {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			object-fit: cover;
			border: 2px solid #A0D7A0;
		}

		/* Botón para subir imagen */
		.uploadimg {
			position: absolute;
			top: -10px;
			right: -10px;
			background-color: #A0D7A0;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			transition: transform 0.2s ease;
		}

		.uploadimg:hover {
			transform: scale(1.1);
		}

		#imageUpload {
			display: none;
		}

		.upload-icon {
			width: 60%;
			height: auto;
		}
		#imgup{
			display: block;
			margin: 0 auto;
		}`;

		shadow.appendChild(style);
		let container = document.createElement('div');
		container.classList.add('wrapper');
		container.innerHTML = /*html*/`
		<div id="testing">
			<div class="card-switch">
				<label class="switch">
					<div class="flip-card__inner">
						<div class="flip-card__front">
							<form action="" id="loginForm" class="flip-card__form">
								<div class="imgContainer">
									<img src="${localStorage.getItem('user_img')}" id="profileImage">
									<!-- Botón para subir imagen -->
									<div class="uploadimg">
										<label for="imageUpload" class="form-label">
											<img id="imgup" src="../images/uploadimg.png" alt="upload img" class="upload-icon">
										</label>
									</div>
								</div>
								<h3 id="textconf">Configura la informacion de tu perfil</h3>
								<div class="form-row">
									<label for="Alies" class="form-label">Alias</label>
									<input type="name" id="Alies" placeholder="${localStorage.getItem('username')}" name="Alies" class="flip-card__input" disabled>
								</div>
								<div class="form-row">
									<label for="nombre" class="form-label">Nombre</label>
									<input type="nombre" id="nombre" placeholder="${localStorage.getItem('name')}" name="nombre" class="flip-card__input">
								</div>
								<div class="form-row">
									<label for="segundoname" class="form-label">Segundo Nombre</label>
									<input type="name" id="segundoname" placeholder="${localStorage.getItem('last_name')}" name="segundoname" class="flip-card__input">
								</div>
								<div class="flip-card__btn" id="intra-button" href="">
									<a id="act">Actualizar</a>
								</div>
							</form>
						</div>
					</div>
				</label>
			</div>
		</div>`;
		shadow.appendChild(container);
    }
	connectedCallback() {
		const shadow = this.shadowRoot;
		const imgUploadButton = shadow.querySelector("#imgup");
	
		if (imgUploadButton) {
			imgUploadButton.addEventListener("click", () => {
				const inputFile = document.createElement("input");
				inputFile.type = "file";
				inputFile.id = "imageUpload";
				inputFile.className = "flip-card__input";
				inputFile.accept = "image/*";
				inputFile.onchange = (event) => this.loadImage(event);
				inputFile.click(); // Activa el input
			});
		}
		const actButton = shadow.querySelector("#act");
		if (actButton) {
			actButton.addEventListener("click", async () => {
				const name = shadow.querySelector("#nombre").value;
				console.log("name" + name)
				const last_name = shadow.querySelector("#segundoname").value;
				const profileImage = shadow.querySelector("#profileImage").src;
				let token = getCookie('access_token');
		
				const formData = new FormData();
				formData.append('name', name);
				formData.append('last_name', last_name);
				formData.append('img', profileImage)
				console.log(profileImage);

				try {
					const response = await fetch("https://localhost:3042/users/upload_avatar", {
						method: "POST",
						headers: {
							'Authorization': `Bearer ${token}`,
						},
						body: formData,
					});
		
					if (!response.ok) {
						throw new Error('Error en la petición');
					}
		
					const result = await response.json();
					console.log(result);
					localStorage.setItem('name', name);
					localStorage.setItem('last_name', last_name);
					localStorage.setItem('user_img', profileImage);
		
				} catch (error) {
					console.error(error);
				}
			});
		}
		
	}
	
	loadImage(event) {
		const file = event.target.files[0];
		if (file) {
			if (file.size <= TWO_MEGABYTES) {
				const reader = new FileReader();
				reader.onload = (e) => {
					// Cambiar la imagen de perfil con el nuevo archivo
					const profileImage = this.shadowRoot.querySelector("#profileImage");
					profileImage.src = e.target.result;
	
					// Guardar la imagen en localStorage
					localStorage.setItem('user_img', e.target.result);
				};
				reader.readAsDataURL(file);
			}
			else {
				// Limpiar el input de archivo si el tamaño es demasiado grande
				const inputFile = this.shadowRoot.querySelector("#imageUpload");
				inputFile.value = '';
				createToast('warning', 'File size too big');
			}
		}
	};
	
    disconnectedCallback(){
    }
}


customElements.define('configprofile-configprofile', profileconfig);

export default function configProfile () {
    return ('<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><configprofile-configprofile></configprofile-configprofile>');
}
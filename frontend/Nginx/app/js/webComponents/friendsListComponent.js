class friendsList extends HTMLElement{
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		style.textContent = /*css*/`
				#logstatus{
					background-color: green;
					border-radius: 50%;
					height: 10px;
					width: 10px;
				}
				.friendsContainer{
					font-family: 'Press Start 2P', cursive;
					font-size: 0.8rem;
					padding: 1rem;
					background-color: #2b3339;
					display:flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					width: 10vw;
					height: 35vh;
					position: fixed;
					top: 60%;
					transform: translateY(-50%);
					right: 3rem;
					border-radius: 30px;
					box-shadow: 0 0 10px 2px rgba(0,0,0,0.5);
				}
				.friendsContainer:hover{
					height: 45vh;
					width: 15vw;
					box-shadow: 0 0 15px 3px rgba(0,15,5,0.8);
					transition: all 0.5s ease-in-out;
				}
				.friend-div{
					color: rgba(160, 215, 160, 0.9);
					margin: 4px;
					display: flex;
					justify-content: space-between;
					padding: 10px;
					width: 100%;
					border-bottom: 1px solid #323c41;
					box-shadow: 0 0 5px 0 rgba(0,0,0,0.3);
					border-radius: 10px;
				}
				.friend-div:hover{
					color: rgba(200, 225, 200, 0.7);
					box-shadow: 0 0 8px 3px rgba(0, 20, 5, 0.8);
					transform: translatey(-1px);
					transition: all 0.1s ease-in-out;
				}
		`;
		shadow.appendChild(style);
		this.container = document.createElement('div');
		this.container.className = 'friendsContainer';
		shadow.appendChild(this.container);
	}
	async connectedCallback(){
		let username = localStorage.getItem('username');
		let token = getCookie('access_token');
		console.log(token);
		try {
			let response = await fetch(`http://localhost:8000/users/listFriends?username=${username}`,{
				headers: {
					'Authorization': `Bearer ${token}`
				}
		});
			if (!response.ok){
				throw new Error('Error en la peticion');
			}
			let friends = await response.json();
			console.log(friends);
			this.renderFriends(friends);
		}catch(error){
			let fallbackFriends = [{name: 'amigo 1'}, {name:"amigo 2"}, {name:"amigo 3"}];
			this.renderFriends(fallbackFriends);
		}
	}
	renderFriends(friends){
		this.container.innerHTML = '';
		console.log(friends.length);
		if(friends.length === 0){
			let noFriends = document.createElement('div');
			noFriends.className = 'friend-div';
			noFriends.textContent = 'No tienes amigos';
			this.container.appendChild(noFriends);
		}else{
			friends.forEach(friend => {
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

window.customElements.define("friends-list", friendsList);
export default friendsList;

export function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
			console.log(cookiePair[1]);
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
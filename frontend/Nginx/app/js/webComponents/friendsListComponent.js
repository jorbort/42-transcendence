class friendsList extends HTMLElement{
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let style = document.createElement('style');
		
		style.textContent = /*css*/`
				.active{
					background-color: green;
					box-shadow: 0px 0px 5px 2px green;
					border-radius: 50%;
					height: 10px;
					width: 10px;
				}
				.inactive{
					background-color: red;
					box-shadow:0px 0px 5px 2px red;
					border-radius: 50%;
					height: 10px;
					width: 10px;
				}
				.addFriendButton:active, #add-btn:active {
					box-shadow: 0px 0px #A0D7A0;
					transform: translate(5px, 5px);
				} 
				.addFriendButton {
					display: none;
					position: absolute;
					bottom: 10px;
					margin: 10px 0 10px 0;
					width: 9rem;
					height: 3.5rem;
					border-radius: 5px;
					align-self: center;
					border: 2px solid #A0D7A0;
					background-color: #2b3339;
					box-shadow: 4px 4px #A0D7A0;
					font-weight: 600;
					color: #e67e80;
					cursor: pointer;
					font-size: 0.6rem;
					font-family: "Press Start 2P";
				}
				.friendsContainer:hover .addFriendButton{
					display: block;
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
				.modal {
				color: rgba(160, 215, 160, 0.9);
				display: none;
				position: fixed;
				z-index: 1;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				overflow: auto;
				background-color: rgb(0,0,0);
				background-color: rgba(0,0,0,0.4);
				}
				.modal-content {
					background-color: #2b3339;
					margin: 15% auto;
					padding: 20px;
					border: 1px solid #888;
					width: 80%;
				}
				.close {
					color: #aaa;
					float: right;
					font-size: 28px;
					font-weight: bold;
				}
				.close:hover,
				.close:focus {
					color: black;
					text-decoration: none;
					cursor: pointer;
				}
				#friendName{
					border-radius: 5px;
					border: 2px solid #A0D7A0;
					background-color: #2b3339;
					box-shadow: 4px 4px #A0D7A0;
					font-size: 15px;
					font-weight: 600;
					color: #e67e80;
					padding: 5px 10px;
					outline: none;
					font-family: "Press Start 2p";
				}
				#add-btn{
					border-radius: 5px;
					height: 2rem;
					border: 2px solid #A0D7A0;
					background-color: #2b3339;
					box-shadow: 4px 4px #A0D7A0;
					font-weight: 600;
					color: #e67e80;
					cursor: pointer;
					font-size: 0.6rem;
					font-family: "Press Start 2P";
				}
		`;
		shadow.appendChild(style);
		this.container = document.createElement('div');
		this.container.className = 'friendsContainer';
		
		this.addButton = document.createElement('button');
		this.addButton.textContent = 'Make new friends!';
		this.addButton.className = 'addFriendButton';
		this.container.appendChild(this.addButton);

		this.modal = document.createElement('div');
		this.modal.className = 'modal';

		this.modal.innerHTML = /*html*/`
			<div class= 'modal-content'>
				<span class='close'>&times;</span>
				<h2>Add a new Friend</h2>
				<form id='addFriendForm'>
					<div id="error-addFriend" style="color: red;"></div>
					<label for='friendName'>Friend's name:</label>
					<input type='text' id='friendName' name='friendName' required>
					<button type='submit' id="add-btn">Add Friend!</button>
				</form>
			</div>
		`;
		shadow.appendChild(this.modal);
		shadow.appendChild(this.container);

		let addFriendForm = this.modal.querySelector('#addFriendForm');
		
		addFriendForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const friend_username = event.target.friendName.value;
			const token = getCookie('access_token');
			const errorAddFriend = this.modal.querySelector('#error-addFriend');
			errorAddFriend.textContent = '';
			try {
				const response = await fetch('https://localhost:3042/users/friends', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ friend_username })
				});
				if (!response.ok) {
					const errorData = await response.json();
					errorAddFriend.textContent = "Friend doesn't exist";
				}
				const result = await response.json();
				this.fetchFriends();
				this.modal.style.display = 'none';
			} catch (error) {
			}
		});
	}
	async connectedCallback(){
		this.connectWebSocket();
		this.fetchFriends();

		this.addButton.addEventListener('click', () => {
			this.modal.style.display = 'block';
		});
		
		this.modal.querySelector('.close').addEventListener('click', () => {
			this.modal.style.display = 'none';
		});
		
		window.addEventListener('click', (event) => {
			if (event.target === this.modal) {
				this.modal.style.display = 'none';
			}
		});

	}

	connectWebSocket() {
        const username = localStorage.getItem('username');
        this.socket = new WebSocket(`ws://localhost:8000/ws/friends/${username}/`);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updateFriendStatus(data.message);
        };

        this.socket.onclose = (event) => {
        };
    }

    updateFriendStatus(message) {
        const [username, status] = message.split(' is ');
        const friendDiv = this.container.querySelector(`.friend-div[data-username="${username}"]`);
        if (friendDiv) {
            const logstatus = friendDiv.querySelector('#logstatus');
            logstatus.className = status === 'online' ? 'active' : 'inactive';
        }
    }

	async fetchFriends(){
		let username = localStorage.getItem('username');
		let token = getCookie('access_token');
		try {
			let response = await fetch(`https://localhost:3042/users/listFriends?username=${username}`,{
				headers: {
					'Authorization': `Bearer ${token}`
				}
		});
			if (!response.ok){
				refreshToken();
				throw new Error('Error en la peticion');
			}
			let friends = await response.json();
			this.renderFriends(friends);
		}catch(error){
			let fallbackFriends = [{name: 'amigo 1'}, {name:"amigo 2"}, {name:"amigo 3"}];
			this.renderFriends(fallbackFriends);
		}
	}
	renderFriends(friends){
		const friendDivs = this.container.querySelectorAll('.friend-div');
    
		if (friendDivs.length > 0) {
			friendDivs.forEach(friendDiv => this.container.removeChild(friendDiv));
		}
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
				friendDiv.setAttribute('data-username', friend.user1 === localStorage.getItem('username') ? friend.user2 : friend.user1);
				logstatus.id = 'logstatus';
				logstatus.className = 'inactive';
				friendDiv.textContent = friend.user1 === localStorage.getItem('username') ? friend.user2 : friend.user1; 
				friendDiv.appendChild(logstatus);
				this.container.appendChild(friendDiv);
			});
		}

	}
	disconectedCallback(){
		if (this.socket){
			this.socket.close();
		}
	}
}

window.customElements.define("friends-list", friendsList);
export default friendsList;

export function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

async function refreshToken() {
    try {
        let response = await fetch('https://localhost:8000/users/TokenRefresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh_token: getCookie('refresh_token')
            })
        });
        if (!response.ok) {
            throw new Error('Failed to refresh token: ' + response.status);
        }
        let data = await response.json();
        document.cookie = `access_token=${data.access_token}; path=/`;
        return data.access_token;
    } catch (error) {
        return null;
    }
}
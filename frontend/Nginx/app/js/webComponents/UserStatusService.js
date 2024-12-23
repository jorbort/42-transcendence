class UserStatusService{
	constructor(){
		this.socket = null;
		this.listeners = new Set();
	}

	connect(username){
		if (this.socket){
			return;
		}
		this.socket = new WebSocket(`wss://localhost:3042/ws/friends/${username}/`);
		
		this.socket.onopen = () => {
        };

		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			this.notifyListeners(data.message);
		};

		this.socket.onerror = (event) => {
			console.error('WebSocket error observed:', event);
			this.socket = null;
		}

		this.socket.onclose = (event) => {
			console.error('WebSocket error observed:', event);
			this.socket = null;
		};
	}

	disconnect(){
		if (this.socket){
			this.socket.close();
			this.socket = null;
		}
	}

	addListener(callback){
		this.listeners.add(callback);
	}

	removeListener(callback){
		this.listeners.delete(callback);
	}

	notifyListeners(message){
		this.listeners.forEach(listener => listener(message));
	}
}

export const userStatusService = new UserStatusService();
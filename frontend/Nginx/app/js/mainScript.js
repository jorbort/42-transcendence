import {createUser, signup} from './views/createUser.js';
import {loginView, signin} from './views/loginView.js';
import {} from './views/loginView.js';

// import {otpView, otp} from './views/otpView.js';
// import {getCookie} from './utils/sessionToken.js';
import tableView from './views/highScores.js';
import renderPongGameIA from './views/pongIA.js';
import renderPongGame from './views/pong.js';
import renderPongGameMulti from './views/pongMulti.js';
import { fortyTwoCallback } from './views/fortyTwoCallback.js';
import { updateNav } from './utils/updateNav.js';
import renderPongGameName from './views/pongNamePlayers.js';
import rendertorneo from './views/torneo.js';


const userlogged = 0;
let accessToken = 0;

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function() {
	accessToken = getCookie('access_token');
});

export function handleRouteChange() {
	let path = window.location.pathname;
	let view;
	if (path === '/') {
		path = '/login';
	}
	
	let pathParts = path.split('/');
	console.log("pathSplit: " + pathParts[1]);
	console.log("path: " + path);

	if (accessToken){
		// updateNav();
		switch ("/" + pathParts[1]) {
				case '/Profile':
					view = tableView();
					break;
				case '/localgame1vsIA':
					view = renderPongGameIA();
					break;
				case '/localgame1vs1':
					// if (pathParts.length == 4)
						// view = renderPongGameName(pathParts[2], pathParts[3]);
					// else
						// view =  renderPongGame();
					view = renderPongGameName("Marc", "Edgar");
					break;
				case '/localgameMulti':
					view = renderPongGameMulti();
					break;
				case '/torneo':
					view = rendertorneo();
					break;
				default:
				view = '<h1>404 Not Found</h1>';
		}
	}else{
		switch ("/" + pathParts[1]) {
			case '/login':
				view = loginView();
				break;
			case '/localgame1vsIA':
				view = renderPongGameIA();
				break;
			case '/localgame1vs1':
				// if (pathParts.length == 4)
				// 	view = renderPongGameName(pathParts[2], pathParts[3]);
				// else
				// 	view =  renderPongGame();
				view = renderPongGameName("Marc", "Edgar");
					break;
			case '/localgameMulti':
				view = renderPongGameMulti();
				break;
			case '/callback_42':
				view = fortyTwoCallback();
				break;
			case '/Signup':
				view = createUser();
				break;
			case '/torneo':
				view = rendertorneo();
				break;
			default:
				view = '<h1>404 Not Found</h1>';
		}
	}
	console.log("print view: " + view)
	const appElement = document.getElementById('app');
	console.log("app: " + appElement); 
	document.getElementById('app').innerHTML = view;
	handleEventListeners(path);
}

function handleEventListeners(path) {
	switch (path) {
		case '/Signup':
			signup();
			break;
		case '/login':
			signin();
			break;
	}
}

document.querySelectorAll('.route').forEach(link => {
	link.addEventListener('click', function(e) {
		e.preventDefault();
		history.pushState(null, '', this.href);
		handleRouteChange();
	});
});

// Call handleRouteChange when the page loads
window.addEventListener('load', handleRouteChange);
// 'popstate': This is the event type being listened for. The popstate event is triggered when the active history entry changes.
window.addEventListener('popstate', handleRouteChange);

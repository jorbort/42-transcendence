import {createUser, signup} from './views/createUser.js';
import {loginView, signin} from './views/loginView.js';
import {} from './views/loginView.js';

// import {otpView, otp} from './views/otpView.js';
// import {getCookie} from './utils/sessionToken.js';
import tableView from './views/highScores.js';
import renderPongGameIA from './views/pongIA.js';
import renderPongGame from './views/pong.js';
import { fortyTwoCallback } from './views/fortyTwoCallback.js';
import { updateNav } from './utils/updateNav.js';

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
	console.log('Path:', path);
	let view;
	if (path === '/') {
		path = '/login';
	}
	console.log('Path:', path);
	if (accessToken){
		// updateNav();
		switch (path) {
				case '/Profile':
					view = tableView();
					break;
				case '/localgame1vsIA':
					view = renderPongGameIA();
					break;
				case '/localgame1vs1':
					view =  renderPongGame();
					break;
				default:
				view = '<h1>404 Not Found</h1>';
		}
	}else{
		switch (path) {
			case '/login':
				view = loginView();
				break;
			case '/localgame1vsIA':
				view = renderPongGameIA();
				break;
			case '/localgame1vs1':
				view = renderPongGame();
				break;
			case '/callback_42':
				view = fortyTwoCallback();
				break;
			case '/Signup':
				view = createUser();
				break;
			default:
				view = '<h1>404 Not Found</h1>';
				
		}
	}
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

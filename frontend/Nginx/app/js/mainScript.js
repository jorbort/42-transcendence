import {createUser, signup} from './views/createUser.js';
import {loginView, signin} from './views/loginView.js';
// import {otpView, otp} from './views/otpView.js';
// import {getCookie} from './utils/sessionToken.js';
import tableView from './views/highScores.js';
import { fortyTwoCallback } from './views/fortyTwoCallback.js';

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
	const path = window.location.pathname;
	let view;
	if (accessToken){
		switch (path) {
				case '/Profile/':
					view = tableView();
					break;
				//  case '/game':
				// view = gameScreen();
				// break;
				// case '/game':
				// view = gameScreen();
				// break;
			default:
				view = '<h1>404</h1>';
		}
	}else{
		switch (path) {
			case '/Signup':
				view = createUser();
				break;
			case '/login':
				view = loginView();
				break;
			case '/callback_42':
				view = fortyTwoCallback();
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
		// case '/login/otp':
		// 	const otp = prompt('Please enter your OTP:');
		// if (otp) {
		// 	// Handle OTP submission
		// 	verifyOtp(otp);
		// } else {
		// 	console.log('OTP input was cancelled.');
		// }
		// break;
	}
}

document.querySelectorAll('.route').forEach(link => {
	link.addEventListener('click', function(e) {
		e.preventDefault();
		history.pushState(null, '', this.href);
		handleRouteChange();
	});
});

handleRouteChange();
// Call handleRouteChange when the page loads
window.addEventListener('load', handleRouteChange);
// 'popstate': This is the event type being listened for. The popstate event is triggered when the active history entry changes.
window.addEventListener('popstate', handleRouteChange);

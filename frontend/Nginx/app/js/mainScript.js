import { createUser, signup } from './views/createUser.js';
import { loginView } from './views/loginView.js';
import homePage from './views/homeProfile.js';
import { LoaderComponent } from './webComponents/loaderComponent.js';


import { otpView } from './views/otpView.js';

import tableView from './views/highScores.js';
import renderPongGameIA from './views/pongIA.js';
import renderPongGame from './views/pong.js';
import renderPongGameMulti from './views/pongMulti.js';
import { fortyTwoCallback } from './views/fortyTwoCallback.js';
import configProfile from './views/configProfile.js';
import NotFound404 from './views/404.js';
import renderTournamentApp from './views/newTournament.js';



let accessToken = 0;

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function () {
	accessToken = getCookie('access_token');
});

export function handleRouteChange() {
	let path = window.location.pathname;
	let view;
	if (path === '/') {
		path = '/login';
	}

	if (accessToken) {
		switch (path) {
			case '/Profile':
				view = homePage();
				break;
			case '/localgame1vsIA':
				view = renderPongGameIA();
				break;
			case '/localgame1vs1':
				view = renderPongGame();
				break;
			case '/localgameMulti':
				view = renderPongGameMulti();
				break;
			case '/torneo':
				view = renderTournamentApp();
				break;
			case '/login':
				view = loginView();
				break;
			case '/configProfile':
				view = configProfile();
				break;
			case '/highScores':
				view = tableView();
				break;
			default:
				view = NotFound404();
		}
	} else {
		switch (path) {
			case '/login':
				view = loginView();
				break;
			case '/otpView':
				view = otpView();
				break;
			case '/callback_42':
				view = /*html*/`<loader-component></loader-component>`;
				fortyTwoCallback();
				break;
			// case '/torneo':
			// 	view = renderTournamentApp();
			// 	break;
			case '/Signup':
				view = createUser();
				break;
			default:
				view = NotFound404();
		}
	}
	const appElement = document.getElementById('app');
	document.getElementById('app').innerHTML = view;
	handleEventListeners(path);
}

function handleEventListeners(path) {
	switch (path) {
		case '/Signup':
			signup();
			break;
		case '/login':
			break;
	}
}

document.querySelectorAll('.route').forEach(link => {
	link.addEventListener('click', function (e) {
		e.preventDefault();
		history.pushState(null, '', this.href);
		handleRouteChange();
	});
});

window.addEventListener('load', handleRouteChange);
window.addEventListener('popstate', handleRouteChange);

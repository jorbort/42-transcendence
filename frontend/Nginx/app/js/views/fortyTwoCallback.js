import { updateNav } from '../utils/updateNav.js';


export function fortyTwoCallback(){
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const state = urlParams.get('state');
	console.log('Code:', code);
	console.log('State:', state);
	if (code && state){
		fetch('http://localhost:8000/users/callback_42', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({code, state}),
		})
		.then(response => response.json())
		.then(data => {
			if (data.access_token && data.refresh_token){
				document.cookie = `access_token=${data.access_token}`;
				document.cookie = `refresh_token=${data.refresh_token}`;
				// updateNav();
				window.location.href = '/Profile';
				handleRouteChange();
			}else{
				console.error('Error: Failed to obtain access-tokens', data);
				window.location.href = '/';
				handleRouteChange();
			}
		})
		.catch(error => {
			console.error('Error: failed token exchange', error);
			window.location.href = '/';
			handleRouteChange();
		});
	}else{
		console.error('Error: Missing code or state');
		window.location.href = '/';
		handleRouteChange();
	}
}
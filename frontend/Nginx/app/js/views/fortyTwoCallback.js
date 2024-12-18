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
			console.log('Data:', data.name);
			if (data.access_token && data.refresh_token){
				document.cookie = `access_token=${data.access_token}`;
				document.cookie = `refresh_token=${data.refresh_token}`;
				localStorage.setItem('username', data.username);
				localStorage.setItem('user_img', data.user_img);
				localStorage.setItem('email', data.email);
				localStorage.setItem('img42', data.fortytwo_image_url);
				localStorage.setItem('name', data.name);
				localStorage.setItem('last_name', data.last_name);
				localStorage.setItem('mail', data.mail);
				window.location.href = '/Profile';
				handleRouteChange();
			}else{
				console.log('Error: Failed to obtain access-tokens', data);
				console.log('Access-token:', data.access_token);
				window.location.href = '/';
				handleRouteChange();
			}
		})
		.catch(error => {
			console.log('Error: failed token exchange', error);
			console.log('Access-token:', data.access_token);
			window.location.href = '/';
			handleRouteChange();
		});
	}else{
		console.log('Error: Missing code or state');
		console.log('Access-token:', data.access_token);
		window.location.href = '/';
		handleRouteChange();
	}
}
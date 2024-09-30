import aboutView from './views/highScores.js';
import createUser from './views/createUser.js';
import loginView from './views/loginView.js';

const userlogged = 0;

function handleRouteChange() {
	const path = window.location.pathname;
	let view;
	switch (path) {
		// case '/Profile':
		// 	view = aboutView();
		// 	break;
		case '/Signup':
			view = createUser();
			break;
		case '/login/otp':
				view = '<h2>Enter OTP</h2>'; // Simple view for OTP route
				break;
		case '/login':
			view = loginView();
			break;
			// case '/game':
			// view = gameScreen();
			// break;
			// case '/game':
			// view = gameScreen();
			// break;
		default:
			view = '<h1>404</h1>';
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

function signin(){
	console.log('Sign in function called');
	const form = document.getElementById('loginForm');
	if (form) {
		form.addEventListener('submit', async function(event) {
			event.preventDefault();
			console.log('Sign in form submitted');
			const username = document.getElementById('username').value;
			const password = document.getElementById('password').value;
			const formData = {
				username: username,
				password: password,
			};
			const jsonString = JSON.stringify(formData);
			console.log(jsonString);
			try {
				const response = await fetch('http://localhost:8000/users/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: jsonString
				});
				if (response.ok) {
					const data = await response.json();
					console.log(data);
					if (data.detail === 'Verification code sent successfully.') {
						console.log('Verification code sent successfully.');
						otp(data);
					} else {
						console.log('Unexpected response:', data);
						// Handle unexpected response
					}
				} else {
					console.log('HTTP error:', response.status);
				}
			} catch (error) {
				console.error('Error:', error);
			}
		});
	} else {
		console.error('Signin form not found');
	}
}

function signup(){
	console.log('Signup function called');
	const form = document.getElementById('signUpForm');
	if (form) {
		form.addEventListener('submit', async function(event) {
			event.preventDefault();
			console.log('Sign form submitted');
			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;
			const confirm_password = document.getElementById('confirm_password').value;
			let username = document.getElementById('username').value;
			const formData = {
				username: username,
				email: email,
				password: password,
				password2: confirm_password
			};
			const jsonString = JSON.stringify(formData);
			console.log(jsonString);
			try {
				const response = await fetch('http://localhost:8000/users/create', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: jsonString
				});
				if(response.ok){
					const data = await response.json();
					console.log(data);
					alert("User created succesfully")
					window.history.pushState({}, '', '/login');
					handleRouteChange();
				}
				else{
					const errorData = await response.json();
					const emailError = errorData.serializer_errors?.email?.[0];
					const usernameError = errorData.serializer_errors?.username?.[0];
					const errorMessage = emailError || usernameError || 'An error occurred';
					alert(`Error: ${errorMessage}`);
				}
			} catch (error) {
				console.error('Error:', error);
			}
		});
	} else {
		console.error('Signin form not found');
	}
}


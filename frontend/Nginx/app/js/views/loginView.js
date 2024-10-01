import {otpView, otp} from './otpView.js';

export function loginView() {
	return `<div class="form_div">
				<div class="form_container">
					<div class="mt-3">
						<a href="#" class="btn btn-secondary btn-with-bg">
							Sign in with
							<img src="images/42_Logo.svg" alt="Service Logo" style="width: 80px; height: 60px; margin-right: 5px; margin-left: 10px;">
						</a>
					</div>
					<form id="loginForm">
						<br>
						<div class="form_separator">
							--------------- or ----------------
						</div>
						<br>
						<div class="mb-3">
							<label for="text" class="form-label">User Name</label>
							<input type="text" class="form-control" id="username" aria-describedby="emailHelp" required>
						</div>
						<div class="mb-3">
							<label for="password" class="form-label">Password</label>
							<input type="password" class="form-control" id="password" required>
						</div>
						<button type="submit" id="sign_in" class="btn btn-primary">Sign In</button>
					</form>
						<div class="mt-3">
							<a href="/Signup" class="routelink-primary">Don't have an account? Sign up</a>
						</div>
				</div>
			</div>`;
}

export function signin(){
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
						otp(formData.username, formData.password);
					} else {
						console.log('Unexpected response:', data);
						// falta implementar una alarte que avise de que input es erroneo password o username
					}
				} else {
					const errorData = await response.json();
					console.log('HTTP error:', response.status);
					alert('HTTP error:', errorData.serializer_errors);
				}
			} catch (error) {
				console.error('Error:', error);
				alert('Error:', error);
			}
		});
	} else {
		console.error('Signin form not found');
	}
}
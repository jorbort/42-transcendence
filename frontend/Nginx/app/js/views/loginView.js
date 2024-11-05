import {otpView, otp} from './otpView.js';

export function loginView() {
	return `<div class="form_div">
				<div class="form_container">
					<div class="mt-3">
						<a href="http://localhost:8000/users/login_42" class="btn btn-secondary btn-with-bg">
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
						<button type="submit" id="sign_in" class="btn btn-primary">
							<span class="button-text">Sign In</span>
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
							<span class="loading-text" style="display: none;">....Loading </span>						
						</button>
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
	const signInButton = document.getElementById('sign_in');
	const buttonText = signInButton.querySelector('.button-text');
	const spinner = signInButton.querySelector('.spinner-border');
	const loadingText = signInButton.querySelector('.loading-text');
	
	// document.getElementById('loginButton').addEventListener('click', function() {
	// this.classList.add('disabled');
	// this.setAttribute('aria-disabled', 'true');
	// });

	if (form) {
		form.addEventListener('submit', async function(event) {
			event.preventDefault();
			console.log('Sign in form submitted');
			
			showSpinner();

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
			}finally{
				hideSpinner();
			}
		});
	} else {
		console.error('Signin form not found');
	}
	function showSpinner() {
		buttonText.style.display = 'none';
		loadingText.style.display = 'inline-block';
		spinner.style.display = 'inline-block';
		signInButton.disabled = true;
	}
	function hideSpinner() {
		buttonText.style.display = 'inline-block';
		loadingText.style.display = 'none';
		spinner.style.display = 'none';
		signInButton.disabled = false;
	}
}
import { handleRouteChange } from '../mainScript.js';

export function createUser() {
	return `<div class="form_div">
				<div class="form_container">
					<form id="signUpForm">
						<div class="mb-3">
							<label for="username" class="form-label">Name</label>
							<input type="text" class="form-control" id="username" required>
						</div>
						<div class="mb-3">
							<label for="email" class="form-label">Email address</label>
							<input type="email" class="form-control" id="email" aria-describedby="emailHelp" required>
						</div>
						<div class="mb-3">
							<label for="password" class="form-label">Password</label>
							<input type="password" class="form-control" id="password" required>
						</div>
						<div class="mb-3">
							<label for="password" class="form-label">Confirm Password</label>
							<input type="password" class="form-control" id="confirm_password" required>
						</div>
						<button type="submit" id="sign_up" class="btn btn-primary">
							<span class="button-text">Sign Up</span>
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
							<span class="loading-text" style="display: none;">....Loading </span>
						</button>
					</form>
				</div>
			</div>`;
}

export function signup(){
	console.log('Signup function called');
	const form = document.getElementById('signUpForm');
	const signUpButton = document.getElementById('sign_up');
	const buttonText = signUpButton.querySelector('.button-text');
	const loadingText = signUpButton.querySelector('.loading-text');
	const spinner = signUpButton.querySelector('.spinner-border');
		
	if (form) {
		form.addEventListener('submit', async function(event) {
			event.preventDefault();
			console.log('Sign form submitted');
			
			showSpinner();
			
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
			} finally {
				hideSpinner();
			}
		});
	} else {
		console.error('Signin form not found');
	}

	function showSpinner() {
		buttonText.style.display = 'none';
		spinner.style.display = 'inline-block';
		loadingText.style.display = 'inline-block';
		signUpButton.disabled = true;
	}
	
	function hideSpinner() {
		spinner.style.display = 'none';
		loadingText.style.display = 'none';
		buttonText.style.display = 'inline-block';
		signUpButton.disabled = false;
	}
}
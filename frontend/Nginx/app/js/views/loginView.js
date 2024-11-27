
import loginFormComponent from '../webComponents/loginFormComponent.js';
import  TitleComponent  from '../webComponents/TitleComponent.js';

export function loginView() {
	return /*html*/`
		<div id='app'>
			<title-tag></title-tag>
			<login-form></login-form>
		<div>
	`;
}

// export function signin(){
// 	console.log('Sign in function called');
// 	const form = document.getElementById('loginForm');
// 	const signInButton = document.getElementById('sign_in');
// 	const buttonText = signInButton.querySelector('.button-text');
// 	const spinner = signInButton.querySelector('.spinner-border');
// 	const loadingText = signInButton.querySelector('.loading-text');
	
// 	// document.getElementById('loginButton').addEventListener('click', function() {
// 	// this.classList.add('disabled');
// 	// this.setAttribute('aria-disabled', 'true');
// 	// });

// 	if (form) {
// 		form.addEventListener('submit', async function(event) {
// 			event.preventDefault();
// 			console.log('Sign in form submitted');
			
// 			showSpinner();

// 			const username = document.getElementById('username').value;
// 			const password = document.getElementById('password').value;
// 			const formData = {
// 				username: username,
// 				password: password,
// 			};
// 			const jsonString = JSON.stringify(formData);
// 			console.log(jsonString);
// 			try {
// 				const response = await fetch('http://localhost:8000/users/login', {
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: jsonString
// 				});
// 				if (response.ok) {
// 					const data = await response.json();
// 					console.log(data);
// 					if (data.detail === 'Verification code sent successfully.') {
// 						console.log('Verification code sent successfully.');
// 						otp(formData.username, formData.password);
// 					} else {
// 						console.log('Unexpected response:', data);
// 						// falta implementar una alarte que avise de que input es erroneo password o username
// 					}
// 				} else {
// 					const errorData = await response.json();
// 					console.log('HTTP error:', response.status);
// 					alert('HTTP error:', errorData.serializer_errors);
// 				}
// 			} catch (error) {
// 				console.error('Error:', error);
// 				alert('Error:', error);
// 			}finally{
// 				hideSpinner();
// 			}
// 		});
// 	} else {
// 		console.error('Signin form not found');
// 	}
// 	function showSpinner() {
// 		buttonText.style.display = 'none';
// 		loadingText.style.display = 'inline-block';
// 		spinner.style.display = 'inline-block';
// 		signInButton.disabled = true;
// 	}
// 	function hideSpinner() {
// 		buttonText.style.display = 'inline-block';
// 		loadingText.style.display = 'none';
// 		spinner.style.display = 'none';
// 		signInButton.disabled = false;
// 	}
// }
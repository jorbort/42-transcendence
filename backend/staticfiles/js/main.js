

let body = document.querySelector('#home-body');

let div = document.createElement('div');
div.className = 'card';

div.innerHTML = ` <div class="container">
	<div id="register">Create account</div>
	<div id="42-login">Login with 42</div>
	<div id="logger">Already have an account</div>
</div>`;

body.appendChild(div);

register.addEventListener('click', () => {
	body.innerHTML = '';
	body.appendChild(registerForm());
});

// 42-login.addEventListener('click', () => {
// 	body.innerHTML = '';
// 	body.appendChild(itraNetloginForm());
// });


logger.addEventListener('click', () => {
	body.innerHTML = '';
	body.appendChild(loginForm());
});

function registerForm() {
	let registraitonForm = document.createElement('div');
	registraitonForm.innerHTML = `
	<form id="registrationForm">
		<div>
			<label for="username">Username:</label>
			<input type="text" id="username" name="username" required></input>
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" required></input>
		</div>
		<div>
			<label for="password2">Confirm Password:</label>
			<input type="password" id="password2" name="password2" required></input>
		</div>
		<div>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" required></input>
		</div>
		<div>
			<button type="submit">Register</button>
		</div>
	</form>
	`;
	return registraitonForm;
}

function loginForm() {
	let loginForm = document.createElement('div');
	loginForm.innerHTML = `
		 <form id="loginForm">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    `;
    return loginForm;
}
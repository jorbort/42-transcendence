export default function loginView() {
	return `<div class="form_div">
				<div class="form_container">
					<div class="mt-3">
						<a href="#" class="btn btn-secondary btn-with-bg">
							Sign in with
							<img src="../images/42_Logo.svg" alt="Service Logo" style="width: 80px; height: 60px; margin-right: 5px; margin-left: 10px;">
						</a>
					</div>
					<form id="loginForm">
						<br>
						<div class="form_separator">
							--------------- or ----------------
						</div>
						<br>
						<div class="mb-3">
							<label for="email" class="form-label">Email address</label>
							<input type="email" class="form-control" id="email" aria-describedby="emailHelp" required>
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

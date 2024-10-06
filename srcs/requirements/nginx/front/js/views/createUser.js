export default function createUser() {
	return `<div class="form_div">
				<div class="form_container">
					<form id="signInForm">
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
						<button type="submit" id="sign_up" class="btn btn-primary">Sign Up</button>
					</form>
				</div>
			</div>`;
}
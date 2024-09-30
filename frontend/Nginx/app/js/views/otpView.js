export default function otpView() {
	return `<div class="form_div" style="background-color: rgb(0, 0, 0) !important;>
				<div class="row justify-content-center">
					<div class="col-12 col-md-6 col-lg-4" style="min-width: 500px;">
						<div class="card bg-white mb-5 mt-5 border-0" style="box-shadow: 0 12px 15px rgba(0, 0, 0, 0.02);">
							<div class="card-body p-5 text-center">
										<h4>Verify</h4>
										<p>Your code was sent to you via email</p>
								<div class="otp-field mb-4">
										<input type="number" />
										<input type="number" />
										<input type="number" />
										<input type="number" />
										<input type="number" />
										<input type="number" />
								</div>
								<button class="btn btn-primary mb-3"></button>
									Verify
								</button>
								<p class="resend text-muted mb-0">
									Didn't receive code? <a href="">Request again</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>`;
}
export function otpView() {
	return `<div class="form_div" style="background-color: rgb(0, 0, 0) !important;>
				<div class="row justify-content-center">
					<div class="col-12 col-md-6 col-lg-4" style="min-width: 500px;">
						<div class="card bg-white mb-5 mt-5 border-0" style="box-shadow: 0 12px 15px rgba(0, 0, 0, 0.02);">
							<div class="card-body p-5 text-center">
										<h4>Verify</h4>
										<p>Your code was sent to you via email</p>
								<div class="otp-field mb-4 otp-container">
										<input class="otp_input" type="number" maxlength="1"/>
										<input class="otp_input" type="number" maxlength="1"/>
										<input class="otp_input" type="number" maxlength="1"/>
										<input class="otp_input" type="number" maxlength="1"/>
										<input class="otp_input" type="number" maxlength="1"/>
										<input class="otp_input" type="number" maxlength="1"/>
								</div>
								<button id="submit_otp"class="btn btn-primary mb-3">Verify</button>									
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

export function otp(userName, passWord){

	document.getElementById('app').innerHTML = otpView();

	const submitOtpButton = document.getElementById('submit_otp');
	if (submitOtpButton) {
	  submitOtpButton.addEventListener('click', async function(event) {
		event.preventDefault();
		console.log('OTP button clicked');
  
		// Collect OTP values
		const otpInputs = document.querySelectorAll('.otp_input');
		let otpValue = '';
		otpInputs.forEach(input => {
		  if (input.value === '') {
			alert('All OTP fields must be filled');
			throw new Error('Incomplete OTP');
		  }
		  otpValue += input.value;
		});
  
		const formData = {
		  otp: otpValue,
		  username: userName,
		  password: passWord,
		};
		const jsonString = JSON.stringify(formData);
		console.log(jsonString);
  
		try {
		  const response = await fetch('http://localhost:8000/users/verify', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: jsonString
		  });
		  if (response.ok) {
			const responseData = await response.json();
			console.log(responseData);
			alert("OTP verified successfully");
			// Handle successful OTP verification
		  } else {
			const errorData = await response.json();
			const errorMessage = errorData.message || 'An error occurred';
			alert(`Error: ${errorMessage}`);
		  }
		} catch (error) {
		  console.error('Error:', error);
		  alert('An error occurred while trying to verify the OTP.');
		}
	  });
	} else {
	  console.error('Submit OTP button not found');
	}
}
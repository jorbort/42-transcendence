import { handleRouteChange } from '../mainScript.js';
import { updateNav } from '../utils/updateNav.js';

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
								</div>
								<button id="submit_otp"class="btn btn-primary mb-3">
									<span class="button-text">Verify</span>
									<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
									<span class="loading-text" style="display: none;">....Loading </span>
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
	const spinner = submitOtpButton.querySelector('.spinner-border');
	const buttonText = submitOtpButton.querySelector('.button-text');
	const loadingText = submitOtpButton.querySelector('.loading-text');
	
	if (submitOtpButton) {
		submitOtpButton.addEventListener('click', async function(event) {
		event.preventDefault();
		console.log('OTP button clicked');

		showSpinner();

		const otpInputs = document.querySelectorAll('.otp_input');
		let otpValue = '';
		otpInputs.forEach(input => {
			// if (input.value === '') {
			// 	alert('All OTP fields must be filled');
			// 	otpValue = '';
			// }
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
			
				const accessToken = responseData.access_token;
				const refreshToken = responseData.refresh_token;
				
				document.cookie = `access_token=${accessToken}; path=/`;
				document.cookie = `refresh_token=${refreshToken}; path=/`;
				// Access the cookies
				const storedAccessToken = getCookie('access_token');
				const storedRefreshToken = getCookie('refresh_token');

				console.log('Stored Access Token:', storedAccessToken);
				console.log('Stored Refresh Token:', storedRefreshToken);
				console.log('Access Token:' );
				updateNav();
				window.location.pathname = '/Profile';
				// handleRouteChange();
			} else {
				const errorData = await response.json();
				const errorMessage = errorData.message || 'An error occurred';
				if (otpValue === '') {
					alert('All OTP fields must be filled');
				}
				else {
					alert(`Error: ${errorMessage}`);
				}
				clearOtpInputs(otpInputs);
			}
		} catch (error) {
			console.error('Error:', error);
			clearOtpInputs(otpInputs);
			alert('An error occurred while trying to verify the OTP.');
		} finally {
			hideSpinner();
		}
	  });
	} else {
	  console.error('Submit OTP button not found');
	  clearOtpInputs(otpInputs);
	}

	function showSpinner() {
		spinner.style.display = 'inline-block';
		loadingText.style.display = 'inline-block';
		buttonText.style.display = 'none';
		submitOtpButton.disabled = true;
	}
	
	function hideSpinner() {
		spinner.style.display = 'none';
		loadingText.style.display = 'none';
		buttonText.style.display = 'inline-block';
		submitOtpButton.disabled = false;
	}
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

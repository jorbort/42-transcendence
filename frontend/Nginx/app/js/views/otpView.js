
import OTPComponent from '../webComponents/OTPInputComponent.js';

export function otpView() {
	return /*html */`
		<div id="app">
			<otp-tag></otp-tag>
		</div>
		`;
}

// export  function otp(userName, passWord){
// 	// document.getElementById('app').innerHTML = "";
// 	document.getElementById('app').innerHTML = otpView(userName, passWord);
// }
	// const submitOtpButton = document.getElementById('submit_otp');
	// const spinner = submitOtpButton.querySelector('.spinner-border');
	// const buttonText = submitOtpButton.querySelector('.button-text');
	// const loadingText = submitOtpButton.querySelector('.loading-text');
	
// 	if (submitOtpButton) {
// 		submitOtpButton.addEventListener('click', async function(event) {
// 		event.preventDefault();
// 		console.log('OTP button clicked');

// 		const formData = {
// 		  otp: otpValue,
// 		  username: userName,
// 		  password: passWord,
// 		};
// 		const jsonString = JSON.stringify(formData);
// 		console.log(jsonString);
//   		try {
// 			const response = await fetch('http://localhost:8000/users/verify', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json'
// 				},
// 				body: jsonString
// 			});
// 			if (response.ok) {
// 				const responseData = await response.json();
// 				console.log(responseData);
// 				alert("OTP verified successfully");
			
// 				const accessToken = responseData.access_token;
// 				const refreshToken = responseData.refresh_token;
				
// 				document.cookie = `access_token=${accessToken}; path=/`;
// 				document.cookie = `refresh_token=${refreshToken}; path=/`;
// 				// Access the cookies
// 				const storedAccessToken = getCookie('access_token');
// 				const storedRefreshToken = getCookie('refresh_token');

// 				console.log('Stored Access Token:', storedAccessToken);
// 				console.log('Stored Refresh Token:', storedRefreshToken);
// 				console.log('Access Token:' );
// 				updateNav();
// 				window.location.pathname = '/Profile';
// 				// handleRouteChange();
// 			} else {
// 				const errorData = await response.json();
// 				const errorMessage = errorData.message || 'An error occurred';
// 				if (otpValue === '') {
// 					alert('All OTP fields must be filled');
// 				}
// 				else {
// 					alert(`Error: ${errorMessage}`);
// 				}
// 				clearOtpInputs(otpInputs);
// 			}
// 		} catch (error) {
// 			console.error('Error:', error);
// 			clearOtpInputs(otpInputs);
// 			alert('An error occurred while trying to verify the OTP.');
// 		} finally {
// 			hideSpinner();
// 		}
// 	  });
// 	} else {
// 	  console.error('Submit OTP button not found');
// 	  clearOtpInputs(otpInputs);
// 	}

// 	function showSpinner() {
// 		spinner.style.display = 'inline-block';
// 		loadingText.style.display = 'inline-block';
// 		buttonText.style.display = 'none';
// 		submitOtpButton.disabled = true;
// 	}
	
// 	function hideSpinner() {
// 		spinner.style.display = 'none';
// 		loadingText.style.display = 'none';
// 		buttonText.style.display = 'inline-block';
// 		submitOtpButton.disabled = false;
// 	}
// }

// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
// }

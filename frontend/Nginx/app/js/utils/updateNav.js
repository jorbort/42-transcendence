
export function updateNav(){
	console.log('UpdateNav function called');
	const elements = document.querySelectorAll('.hidden');
	elements.forEach(element => {
		if (element.style.display === 'none' || element.style.display === '') {
			element.style.display = 'block'; // or any other display value you prefer
		} else {
			element.style.display = 'none';
		}
	});
	
	const login = document.getElementById('login');
	login.textContent = 'Logout';
	login.classList.add('logout');	
}
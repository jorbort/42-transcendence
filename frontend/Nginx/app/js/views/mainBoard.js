import { handleRouteChange } from '../mainScript.js';

function loadSideMenu(){
	let sideMenu = document.createElement('div');
	sideMenu.className = 'sideMenu';
	
	let sideMenuList = document.createElement('ul');
	sideMenuList.className = 'sideMenuList';
	sideMenuList.innerHTML = `
	<li class="sideBArIcon"><i class="bi bi-house"></li>
	<li class="sideBArIcon"><i class="bi bi-person" ></li> 
	<li class="sideBArIcon "><i class="bi bi-controller" ></li>
	<li class="sideBArIcon "><i class="bi bi-bar-chart-line" ></li>
	<li class="sideBArIcon "><i class="bi bi-pie-chart" ></li>`;
	sideMenu.appendChild(sideMenuList);
	return sideMenu;
}

function loadUpperMenu(){
	let upperMenu  = document.createElement('div');
	upperMenu.className = 'upperMenu';
	let  iconContainer = document.createElement('div');
	iconContainer.className = 'iconContainer';
	iconContainer.innerHTML = '<img src="images/42_Logo.svg">'
	let buttonContainer = document.createElement('div');
	buttonContainer.className = 'buttonContainer';
	buttonContainer.innerHTML = `<i class="bi bi-gear-fill" id='settingsicon'> </i>
	<i class="bi bi-door-open" id="logouticon"> </i>`;
	upperMenu.appendChild(iconContainer);
	upperMenu.appendChild(buttonContainer);
	return upperMenu;
}

function renderContent(){
	var mainDiv = document.createElement('div');
	mainDiv.className = 'mainDiv';
	let sideMenu = loadSideMenu();
	let upperMenu = loadUpperMenu();
	mainDiv.appendChild(sideMenu);
	mainDiv.appendChild(upperMenu);
	// mainDiv.appendChild(loadPlayerInfo());
	// mainDiv.appendChild(loadFriendList());
	// mainDiv.appendChild(laodCenterContent());
	
	return mainDiv;
}
export function mainBoard(){
	let pageContainer = document.getElementsByClassName('pageContainer')[0];
	let pageContent = renderContent();
	pageContainer.appendChild(pageContent);
	
}
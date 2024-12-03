import { handleRouteChange } from '../mainScript.js';

function loadSideMenu(){
	var sideMenu = document.createElement('div');
	sideMenu.className = 'sideMenu';
	
	var sideMenuList = document.createElement('ul');
	sideMenuList.className = 'sideMenuList';
	sideMenuList.innerHTML = `'<li class="sideBArIcon"><i class="bi bi-house"></i></li>
	<li class="sideBArIcon"><i class="bi bi-person" ></></li> 
	<li class="sideBArIcon "><i class="bi bi-controller" ></></li>
	<li class="sideBArIcon "><i class="bi bi-bar-chart-line" ></></li>
	<li class="sideBArIcon "><i class="bi bi-pie-chart" ></></li>`;
	sideMenu.appendChild(sideMenuList);
}

function renderContent(){
	var mainDiv = document.createElement('div');
	mainDiv.className = 'mainDiv';
	mainDiv.appendChild(loadSideMenu());
	mainDiv.appendChild(loadUpperMenu());
	mainDiv.appendChild(loadPlayerInfo());
	mainDiv.appendChild(loadFriendList());
	mainDiv.appendChild(laodCenterContent());
	
	return mainDiv;
}

export function mainBoard(){
	pageContainer = document.getElementsByClassName('page_container');
	pageContainer.innerHtml = '';
	pageContainer.innerHtml = renderContent();
}
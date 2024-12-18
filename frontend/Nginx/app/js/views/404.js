import headerNavBar from '../webComponents/headerNavBar.js';
import HomeComponent from '../webComponents/homeComponent.js';
import SideNavBar from  '../webComponents/sideNavBarComponent.js';

export default function NotFound404() {
	return /*html*/`
	<header-nav-bar></header-nav-bar>
	<side-nav-bar></side-nav-bar>
	<div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;">
		<h1 style="text-align: center;">404 Not Found</h1>
	</div>
	`
}
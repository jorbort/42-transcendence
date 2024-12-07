import friendsList from '../webComponents/friendsListComponent.js';
import headerNavBar from '../webComponents/headerNavBar.js';
import HomeComponent from '../webComponents/homeComponent.js';
import SideNavBar from  '../webComponents/sideNavBarComponent.js';


export default function homePage(){
	return /*html*/`
		<header-nav-bar></header-nav-bar>
		<side-nav-bar></side-nav-bar>
		<home-component></home-component>
		<friends-list></friends-list>
	`
}
import GameStats from "../webComponents/StatsComponent.js"
import headerNavBar from '../webComponents/headerNavBar.js';
import HomeComponent from '../webComponents/homeComponent.js';
import SideNavBar from  '../webComponents/sideNavBarComponent.js';

export default function tableView() {
	return /*html*/`
	<header-nav-bar></header-nav-bar>
	<side-nav-bar></side-nav-bar>
	<gamestats-component></gamestats-component>
	`
}
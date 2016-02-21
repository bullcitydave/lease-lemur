'use strict';

// Configuring the Articles module
angular.module('properties').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Properties', 'properties');
		Menus.addMenuItem('topbar', 'New Property', 'properties/create');
	}
]);
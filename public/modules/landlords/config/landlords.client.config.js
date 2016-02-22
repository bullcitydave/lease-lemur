'use strict';

// Configuring the Articles module
angular.module('landlords').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Landlords', 'landlords');
		// Menus.addMenuItem('topbar', 'New Landlord', 'landlords/create');
	}
]);

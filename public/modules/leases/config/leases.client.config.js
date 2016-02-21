'use strict';

// Configuring the Articles module
angular.module('leases').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Leases', 'leases');
		Menus.addMenuItem('topbar', 'New Lease', 'leases/create');
	}
]);
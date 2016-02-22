'use strict';

// Configuring the Articles module
angular.module('tenants').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tenants', 'tenants');
		// Menus.addMenuItem('topbar', 'New Tenant', 'tenants/create');
	}
]);

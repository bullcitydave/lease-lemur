'use strict';

//Setting up route
angular.module('landlords').config(['$stateProvider',
	function($stateProvider) {
		// Landlords state routing
		$stateProvider.
		state('listLandlords', {
			url: '/landlords',
			templateUrl: 'modules/landlords/views/list-landlords.client.view.html'
		}).
		state('createLandlord', {
			url: '/landlords/create',
			templateUrl: 'modules/landlords/views/create-landlord.client.view.html'
		}).
		state('viewLandlord', {
			url: '/landlords/:landlordId',
			templateUrl: 'modules/landlords/views/view-landlord.client.view.html'
		}).
		state('editLandlord', {
			url: '/landlords/:landlordId/edit',
			templateUrl: 'modules/landlords/views/edit-landlord.client.view.html'
		});
	}
]);
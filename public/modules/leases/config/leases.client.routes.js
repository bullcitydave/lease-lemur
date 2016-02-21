'use strict';

//Setting up route
angular.module('leases').config(['$stateProvider',
	function($stateProvider) {
		// Leases state routing
		$stateProvider.
		state('listLeases', {
			url: '/leases',
			templateUrl: 'modules/leases/views/list-leases.client.view.html'
		}).
		state('createLease', {
			url: '/leases/create',
			templateUrl: 'modules/leases/views/create-lease.client.view.html'
		}).
		state('viewLease', {
			url: '/leases/:leaseId',
			templateUrl: 'modules/leases/views/view-lease.client.view.html'
		}).
		state('editLease', {
			url: '/leases/:leaseId/edit',
			templateUrl: 'modules/leases/views/edit-lease.client.view.html'
		});
	}
]);
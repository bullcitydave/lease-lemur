'use strict';

//Leases service used to communicate Leases REST endpoints
angular.module('leases').factory('Leases', ['$resource', function($resource) {
    return $resource('leases/:leaseId', {
        leaseId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
    });
}]);

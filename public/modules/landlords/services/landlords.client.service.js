'use strict';

//Landlords service used to communicate Landlords REST endpoints
angular.module('landlords').factory('Landlords', ['$resource', function($resource) {
    return $resource('landlords/:landlordId', {
        landlordId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
'use strict';

//Properties service used to communicate Properties REST endpoints
angular.module('properties').factory('Properties', ['$resource', function($resource) {
    return $resource('properties/:propertyId', {
        propertyId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
'use strict';

//Profiles service used to communicate Profiles REST endpoints
angular.module('profiles').factory('Profiles', ['$resource', function($resource) {
    return $resource('profiles/:profileId', {
        profileId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
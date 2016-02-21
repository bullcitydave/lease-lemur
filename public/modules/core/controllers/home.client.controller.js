'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', function ($scope, Authentication) {
    $scope.authentication = Authentication;
    $scope.go = function ( path ) {
      $location.path( path );
    };
}]);

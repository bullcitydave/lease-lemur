'use strict';

// Properties controller
angular.module('properties').controller('PropertiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Properties',
    function($scope, $stateParams, $location, Authentication, Properties) {
        $scope.authentication = Authentication;

        // Create new Property
        $scope.create = function() {
        	// Create new Property object
            var property = new Properties({
                name: this.name
            });

            // Redirect after save
            property.$save(function(response) {
                $location.path('properties/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Property
        $scope.remove = function(property) {
            if (property) {
                property.$remove();

                for (var i in $scope.properties) {
                    if ($scope.properties[i] === property) {
                        $scope.properties.splice(i, 1);
                    }
                }
            } else {
                $scope.property.$remove(function() {
                    $location.path('properties');
                });
            }
        };

        // Update existing Property
        $scope.update = function() {
            var property = $scope.property;

            property.$update(function() {
                $location.path('properties/' + property._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Properties
        $scope.find = function() {
            $scope.properties = Properties.query();
        };

        // Find existing Property
        $scope.findOne = function() {
            $scope.property = Properties.get({
                propertyId: $stateParams.propertyId
            });
        };
    }
]);
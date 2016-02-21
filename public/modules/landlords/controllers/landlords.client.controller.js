'use strict';

// Landlords controller
angular.module('landlords').controller('LandlordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Landlords',
    function($scope, $stateParams, $location, Authentication, Landlords) {
        $scope.authentication = Authentication;

        // Create new Landlord
        $scope.create = function() {
        	// Create new Landlord object
            var landlord = new Landlords({
                name: this.name
            });

            // Redirect after save
            landlord.$save(function(response) {
                $location.path('landlords/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Landlord
        $scope.remove = function(landlord) {
            if (landlord) {
                landlord.$remove();

                for (var i in $scope.landlords) {
                    if ($scope.landlords[i] === landlord) {
                        $scope.landlords.splice(i, 1);
                    }
                }
            } else {
                $scope.landlord.$remove(function() {
                    $location.path('landlords');
                });
            }
        };

        // Update existing Landlord
        $scope.update = function() {
            var landlord = $scope.landlord;

            landlord.$update(function() {
                $location.path('landlords/' + landlord._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Landlords
        $scope.find = function() {
            $scope.landlords = Landlords.query();
        };

        // Find existing Landlord
        $scope.findOne = function() {
            $scope.landlord = Landlords.get({
                landlordId: $stateParams.landlordId
            });
        };
    }
]);
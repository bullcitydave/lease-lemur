'use strict';

// Leases controller
angular.module('leases').controller('LeasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leases',
    function($scope, $stateParams, $location, Authentication, Leases) {
        $scope.authentication = Authentication;

        // Create new Lease
        $scope.create = function() {
        	// Create new Lease object
            var lease = new Leases({
                tenant: this.tenant,
                property: this.property,
                landlord: this.landlord

            });

            // Redirect after save
            lease.$save(function(response) {
                $location.path('leases/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            if (!$scope.error) {
              this.tenant = '';
              this.property = '';
              this.landlord = '';
            }
        };

        // Remove existing Lease
        $scope.remove = function(lease) {
            if (lease) {
                lease.$remove();

                for (var i in $scope.leases) {
                    if ($scope.leases[i] === lease) {
                        $scope.leases.splice(i, 1);
                    }
                }
            } else {
                $scope.lease.$remove(function() {
                    $location.path('leases');
                });
            }
        };

        // Update existing Lease
        $scope.update = function() {
            var lease = $scope.lease;

            lease.$update(function() {
                $location.path('leases/' + lease._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Leases
        $scope.find = function() {
            $scope.leases = Leases.query();
        };

        // Find existing Lease
        $scope.findOne = function() {
            $scope.lease = Leases.get({
                leaseId: $stateParams.leaseId
            });
        };
    }
]);

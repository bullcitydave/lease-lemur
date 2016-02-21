'use strict';

// Profiles controller
angular.module('profiles').controller('ProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profiles',
    function($scope, $stateParams, $location, Authentication, Profiles) {
        $scope.authentication = Authentication;

        // Create new Profile
        $scope.create = function() {
        	// Create new Profile object
            var profile = new Profiles({
                name: this.name
            });

            // Redirect after save
            profile.$save(function(response) {
                $location.path('profiles/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Profile
        $scope.remove = function(profile) {
            if (profile) {
                profile.$remove();

                for (var i in $scope.profiles) {
                    if ($scope.profiles[i] === profile) {
                        $scope.profiles.splice(i, 1);
                    }
                }
            } else {
                $scope.profile.$remove(function() {
                    $location.path('profiles');
                });
            }
        };

        // Update existing Profile
        $scope.update = function() {
            var profile = $scope.profile;

            profile.$update(function() {
                $location.path('profiles/' + profile._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Profiles
        $scope.find = function() {
            $scope.profiles = Profiles.query();
        };

        // Find existing Profile
        $scope.findOne = function() {
            $scope.profile = Profiles.get({
                profileId: $stateParams.profileId
            });
        };
    }
]);
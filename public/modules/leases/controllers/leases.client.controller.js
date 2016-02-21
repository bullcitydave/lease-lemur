'use strict';

// Leases controller
angular.module('leases').controller('LeasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leases',
    function($scope, $stateParams, $location, Authentication, Leases) {
        $scope.authentication = Authentication;

        $scope.startDateOpen = false;

        $scope.go = function ( path ) {
          $location.path( path );
        };

        // Create new Lease
        $scope.create = function() {
        	// Create new Lease object
            var lease = new Leases({
                tenant: this.tenant,
                property: this.property,
                landlord: this.landlord,
                startDate: this.startDate,
                startDate: this.endDate,
                leasePeriods: this.leasePeriods

            });
            // Redirect after save
            if (this.validate()) {
              lease.$save(function(response) {
                  $location.path('leases/' + response._id);
              }, function(errorResponse) {
  			            $scope.error = errorResponse.data.message;
  		             });
                 }

            // Clear form fields
            if (!$scope.error) {
              this.tenant = '';
              this.property = '';
              this.landlord = '';
              this.startDate = '';
              this.leasePeriods  = [];
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

        // Datepicker
        // TODO this code isn't working so well
        $scope.startDateOpen = false;
        $scope.endDateOpen = false;

        $scope.toggleDatePicker = function(event, datePicker) {
          var datePickerOpenName = datePicker + 'Open';
          $scope[datePickerOpenName] = !$scope[datePickerOpenName];
        };

        $scope.validateLeaseStartEndDates = function() {
          var start = $scope.startDate,
              end = $scope.endDate;

          if (start < end) {
            if ($scope.leasePeriods.length <= 1) {
              setSingleLeasePeriod();
            }
            return true;
          }

          function setSingleLeasePeriod() {
            var singleLeasePeriod = {
              startDate : $scope.startDate,
              endDate : $scope.endDate
            }
            if ($scope.leasePeriods.length === 0) {
              $scope.leasePeriods.push(singleLeasePeriod);
            }
            else {
              $scope.leasePeriods[0] = singleLeasePeriod;
            }
          }
        }

        $scope.validate = function() {
          var start = this.startDate,
              end = this.endDate;
          if (start < end) {
              return true;
          }
          else {
            $scope.error = "Start Date must precede End Date";
          }

        }
    }
]);

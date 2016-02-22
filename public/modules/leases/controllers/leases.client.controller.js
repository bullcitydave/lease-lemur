'use strict';

// Leases controller
angular.module('leases').controller('LeasesController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Leases',
    function($scope,  $filter, $stateParams, $location, Authentication, Leases) {
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
                endDate: this.endDate,
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
            lease.startDate = $scope.startDateString;
            lease.endDate = $scope.endDateString;
            for (var period in lease.leasePeriods) {
              lease.leasePeriods[period].startDate = $scope.lease.leasePeriods[period].startDateString;
              lease.leasePeriods[period].endDate = $scope.lease.leasePeriods[period].endDateString;
            }

            if (this.validate()) {

            lease.$update(function() {
                $location.path('leases/' + lease._id);
            }, function(errorResponse) {
          				$scope.error = errorResponse.data.message;
          			});
              }
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
            $scope.lease.$promise.then(function (data) {
              $scope.lease = data;
              $scope.startDateString = $filter('date')(data.startDate, 'MM/dd/yyyy');
              $scope.endDateString = $filter('date')(data.endDate, 'MM/dd/yyyy');
              for (var period in $scope.lease.leasePeriods) {
                $scope.lease.leasePeriods[period].startDateString = $filter('date')($scope.lease.leasePeriods[period].startDate, 'MM/dd/yyyy');
                $scope.lease.leasePeriods[period].endDateString = $filter('date')($scope.lease.leasePeriods[period].endDate, 'MM/dd/yyyy');
              }
            });
        };

        // Datepicker
        // TODO this code isn't working so well
        $scope.startDateOpen = false;
        $scope.endDateOpen = false;

        //
        // $scope.dateFormat = function (mongoDate) {
        //   return new Date(mongoDate);
        // }

        $scope.dateFormat = 'dd-MMMM-yyyy';

        $scope.toggleDatePicker = function(event, datePicker) {
          var datePickerOpenName = datePicker + 'Open';
          $scope[datePickerOpenName] = !$scope[datePickerOpenName];
        };

        $scope.sortDateRanges = function(ranges) {
          return ranges.sort(function(a,b) { return a.startDate > b.startDate; })
        }

        // $scope.mainDateRangeAndPeriodsSync = function(start, end) {
        //   if (start === lease.startDate && end === lease.endDate) {
        //     return true;
        //   }
        //   else {
        //     $scope.error = "Date ranges of periods must match up with overall lease date range";
        //     return false;
        //   }
        // }

        $scope.rangePeriodsNoOverlap = function(ranges) {
          var sortedRanges = this.sortDateRanges(ranges);
          var first = sortedRanges[0].startDate;
          var last = sortedRanges[sortedRanges.length-1].endDate;
          // if (this.mainDateRangeAndPeriodsSync(first, last)) {
            for (var i=0; i < sortedRanges.length - 1; i++) {
              if (sortedRanges[i].startDate === sortedRanges[i+1].startDate ||
                sortedRanges[i].endDate > sortedRanges [i+1].startDate) {
                 $scope.error = "Lease periods " + sortedRanges[i].startDate + ' - ' + sortedRanges[i].endDate + ' and ' + sortedRanges[i+1].startDate + ' - ' + sortedRanges[i+1].endDate + ' overlap';
                 return false;
               }
             }
             return true;
          //  }
         }


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

        $scope.validateMainDateRange = function() {
          var start = this.lease ? this.lease.startDate : this.startDate;
          var end  = this.lease ? this.lease.endDate : this.endDate;
          if (start < end) {
              return true;
          }
          else {
            $scope.error = "Start Date must precede End Date";
            return false;
          }
        }

        $scope.validate = function() {
          return this.validateMainDateRange() && this.rangePeriodsNoOverlap(this.lease ? this.lease.leasePeriods : this.leasePeriods);
        }

        $scope.testing = function() { console.log('trying!'); };


        $scope.addLeasePeriod = function () {
              //  $scope.leasePeriods.push(new LeasePeriod(leasePeriodData));
              $scope.leasePeriods.push(new LeasePeriod());
         }


        function LeasePeriod() {
         var leasePeriodData = {
           startDate : "",
           endDate: "",
           monthlyRate: ""
         }
         return leasePeriodData;
        };

        var itemMethods = {

          addLeasePeriod: function (leasePeriodData) {
               this.leasePeriods.push(new LeasePeriod(leasePeriodData));
             }
           };


         angular.extend(Leases.prototype, itemMethods);
    }
]);

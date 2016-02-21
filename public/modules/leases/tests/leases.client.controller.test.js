'use strict';

(function() {
	// Leases Controller Spec
	describe('Leases Controller Tests', function() {
		// Initialize global variables
		var LeasesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Leases controller.
			LeasesController = $controller('LeasesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Lease object fetched from XHR', inject(function(Leases) {
			// Create sample Lease using the Leases service
			var sampleLease = new Leases({
				name: 'New Lease'
			});

			// Create a sample Leases array that includes the new Lease
			var sampleLeases = [sampleLease];

			// Set GET response
			$httpBackend.expectGET('leases').respond(sampleLeases);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.leases).toEqualData(sampleLeases);
		}));

		it('$scope.findOne() should create an array with one Lease object fetched from XHR using a leaseId URL parameter', inject(function(Leases) {
			// Define a sample Lease object
			var sampleLease = new Leases({
				name: 'New Lease'
			});

			// Set the URL parameter
			$stateParams.leaseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/leases\/([0-9a-fA-F]{24})$/).respond(sampleLease);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lease).toEqualData(sampleLease);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Leases) {
			// Create a sample Lease object
			var sampleLeasePostData = new Leases({
				name: 'New Lease'
			});

			// Create a sample Lease response
			var sampleLeaseResponse = new Leases({
				_id: '525cf20451979dea2c000001',
				name: 'New Lease'
			});

			// Fixture mock form input values
			scope.name = 'New Lease';

			// Set POST response
			$httpBackend.expectPOST('leases', sampleLeasePostData).respond(sampleLeaseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Lease was created
			expect($location.path()).toBe('/leases/' + sampleLeaseResponse._id);
		}));

		it('$scope.update() should update a valid Lease', inject(function(Leases) {
			// Define a sample Lease put data
			var sampleLeasePutData = new Leases({
				_id: '525cf20451979dea2c000001',
				name: 'New Lease'
			});

			// Mock Lease in scope
			scope.lease = sampleLeasePutData;

			// Set PUT response
			$httpBackend.expectPUT(/leases\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/leases/' + sampleLeasePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid leaseId and remove the Lease from the scope', inject(function(Leases) {
			// Create new Lease object
			var sampleLease = new Leases({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Leases array and include the Lease
			scope.leases = [sampleLease];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/leases\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLease);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.leases.length).toBe(0);
		}));
	});
}());
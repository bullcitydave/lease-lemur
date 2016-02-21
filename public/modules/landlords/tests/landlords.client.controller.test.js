'use strict';

(function() {
	// Landlords Controller Spec
	describe('Landlords Controller Tests', function() {
		// Initialize global variables
		var LandlordsController,
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

			// Initialize the Landlords controller.
			LandlordsController = $controller('LandlordsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Landlord object fetched from XHR', inject(function(Landlords) {
			// Create sample Landlord using the Landlords service
			var sampleLandlord = new Landlords({
				name: 'New Landlord'
			});

			// Create a sample Landlords array that includes the new Landlord
			var sampleLandlords = [sampleLandlord];

			// Set GET response
			$httpBackend.expectGET('landlords').respond(sampleLandlords);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.landlords).toEqualData(sampleLandlords);
		}));

		it('$scope.findOne() should create an array with one Landlord object fetched from XHR using a landlordId URL parameter', inject(function(Landlords) {
			// Define a sample Landlord object
			var sampleLandlord = new Landlords({
				name: 'New Landlord'
			});

			// Set the URL parameter
			$stateParams.landlordId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/landlords\/([0-9a-fA-F]{24})$/).respond(sampleLandlord);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.landlord).toEqualData(sampleLandlord);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Landlords) {
			// Create a sample Landlord object
			var sampleLandlordPostData = new Landlords({
				name: 'New Landlord'
			});

			// Create a sample Landlord response
			var sampleLandlordResponse = new Landlords({
				_id: '525cf20451979dea2c000001',
				name: 'New Landlord'
			});

			// Fixture mock form input values
			scope.name = 'New Landlord';

			// Set POST response
			$httpBackend.expectPOST('landlords', sampleLandlordPostData).respond(sampleLandlordResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Landlord was created
			expect($location.path()).toBe('/landlords/' + sampleLandlordResponse._id);
		}));

		it('$scope.update() should update a valid Landlord', inject(function(Landlords) {
			// Define a sample Landlord put data
			var sampleLandlordPutData = new Landlords({
				_id: '525cf20451979dea2c000001',
				name: 'New Landlord'
			});

			// Mock Landlord in scope
			scope.landlord = sampleLandlordPutData;

			// Set PUT response
			$httpBackend.expectPUT(/landlords\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/landlords/' + sampleLandlordPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid landlordId and remove the Landlord from the scope', inject(function(Landlords) {
			// Create new Landlord object
			var sampleLandlord = new Landlords({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Landlords array and include the Landlord
			scope.landlords = [sampleLandlord];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/landlords\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLandlord);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.landlords.length).toBe(0);
		}));
	});
}());
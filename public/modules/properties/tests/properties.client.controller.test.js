'use strict';

(function() {
	// Properties Controller Spec
	describe('Properties Controller Tests', function() {
		// Initialize global variables
		var PropertiesController,
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

			// Initialize the Properties controller.
			PropertiesController = $controller('PropertiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Property object fetched from XHR', inject(function(Properties) {
			// Create sample Property using the Properties service
			var sampleProperty = new Properties({
				name: 'New Property'
			});

			// Create a sample Properties array that includes the new Property
			var sampleProperties = [sampleProperty];

			// Set GET response
			$httpBackend.expectGET('properties').respond(sampleProperties);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.properties).toEqualData(sampleProperties);
		}));

		it('$scope.findOne() should create an array with one Property object fetched from XHR using a propertyId URL parameter', inject(function(Properties) {
			// Define a sample Property object
			var sampleProperty = new Properties({
				name: 'New Property'
			});

			// Set the URL parameter
			$stateParams.propertyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/properties\/([0-9a-fA-F]{24})$/).respond(sampleProperty);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.property).toEqualData(sampleProperty);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Properties) {
			// Create a sample Property object
			var samplePropertyPostData = new Properties({
				name: 'New Property'
			});

			// Create a sample Property response
			var samplePropertyResponse = new Properties({
				_id: '525cf20451979dea2c000001',
				name: 'New Property'
			});

			// Fixture mock form input values
			scope.name = 'New Property';

			// Set POST response
			$httpBackend.expectPOST('properties', samplePropertyPostData).respond(samplePropertyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Property was created
			expect($location.path()).toBe('/properties/' + samplePropertyResponse._id);
		}));

		it('$scope.update() should update a valid Property', inject(function(Properties) {
			// Define a sample Property put data
			var samplePropertyPutData = new Properties({
				_id: '525cf20451979dea2c000001',
				name: 'New Property'
			});

			// Mock Property in scope
			scope.property = samplePropertyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/properties\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/properties/' + samplePropertyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid propertyId and remove the Property from the scope', inject(function(Properties) {
			// Create new Property object
			var sampleProperty = new Properties({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Properties array and include the Property
			scope.properties = [sampleProperty];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/properties\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProperty);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.properties.length).toBe(0);
		}));
	});
}());
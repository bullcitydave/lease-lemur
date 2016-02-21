'use strict';

(function() {
	// Profiles Controller Spec
	describe('Profiles Controller Tests', function() {
		// Initialize global variables
		var ProfilesController,
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

			// Initialize the Profiles controller.
			ProfilesController = $controller('ProfilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Profile object fetched from XHR', inject(function(Profiles) {
			// Create sample Profile using the Profiles service
			var sampleProfile = new Profiles({
				name: 'New Profile'
			});

			// Create a sample Profiles array that includes the new Profile
			var sampleProfiles = [sampleProfile];

			// Set GET response
			$httpBackend.expectGET('profiles').respond(sampleProfiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.profiles).toEqualData(sampleProfiles);
		}));

		it('$scope.findOne() should create an array with one Profile object fetched from XHR using a profileId URL parameter', inject(function(Profiles) {
			// Define a sample Profile object
			var sampleProfile = new Profiles({
				name: 'New Profile'
			});

			// Set the URL parameter
			$stateParams.profileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/profiles\/([0-9a-fA-F]{24})$/).respond(sampleProfile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.profile).toEqualData(sampleProfile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Profiles) {
			// Create a sample Profile object
			var sampleProfilePostData = new Profiles({
				name: 'New Profile'
			});

			// Create a sample Profile response
			var sampleProfileResponse = new Profiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Profile'
			});

			// Fixture mock form input values
			scope.name = 'New Profile';

			// Set POST response
			$httpBackend.expectPOST('profiles', sampleProfilePostData).respond(sampleProfileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Profile was created
			expect($location.path()).toBe('/profiles/' + sampleProfileResponse._id);
		}));

		it('$scope.update() should update a valid Profile', inject(function(Profiles) {
			// Define a sample Profile put data
			var sampleProfilePutData = new Profiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Profile'
			});

			// Mock Profile in scope
			scope.profile = sampleProfilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/profiles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/profiles/' + sampleProfilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid profileId and remove the Profile from the scope', inject(function(Profiles) {
			// Create new Profile object
			var sampleProfile = new Profiles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Profiles array and include the Profile
			scope.profiles = [sampleProfile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/profiles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProfile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.profiles.length).toBe(0);
		}));
	});
}());
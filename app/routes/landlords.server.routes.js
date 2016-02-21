'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var landlords = require('../../app/controllers/landlords');

	// Landlords Routes
	app.route('/landlords')
		.get(landlords.list)
		.post(users.requiresLogin, landlords.create);
	
	app.route('/landlords/:landlordId')
		.get(landlords.read)
		.put(users.requiresLogin, landlords.hasAuthorization, landlords.update)
	    .delete(users.requiresLogin, landlords.hasAuthorization, landlords.delete);

	// Finish by binding the Landlord middleware
	app.param('landlordId', landlords.landlordByID);
};
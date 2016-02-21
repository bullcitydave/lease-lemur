'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var properties = require('../../app/controllers/properties');

	// Properties Routes
	app.route('/properties')
		.get(properties.list)
		.post(users.requiresLogin, properties.create);
	
	app.route('/properties/:propertyId')
		.get(properties.read)
		.put(users.requiresLogin, properties.hasAuthorization, properties.update)
	    .delete(users.requiresLogin, properties.hasAuthorization, properties.delete);

	// Finish by binding the Property middleware
	app.param('propertyId', properties.propertyByID);
};
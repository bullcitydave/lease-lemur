'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var profiles = require('../../app/controllers/profiles');

	// Profiles Routes
	app.route('/profiles')
		.get(profiles.list)
		.post(users.requiresLogin, profiles.create);
	
	app.route('/profiles/:profileId')
		.get(profiles.read)
		.put(users.requiresLogin, profiles.hasAuthorization, profiles.update)
	    .delete(users.requiresLogin, profiles.hasAuthorization, profiles.delete);

	// Finish by binding the Profile middleware
	app.param('profileId', profiles.profileByID);
};
'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leases = require('../../app/controllers/leases');

	// Leases Routes
	app.route('/leases')
		.get(leases.list)
		.post(users.requiresLogin, leases.create);
	
	app.route('/leases/:leaseId')
		.get(leases.read)
		.put(users.requiresLogin, leases.hasAuthorization, leases.update)
	    .delete(users.requiresLogin, leases.hasAuthorization, leases.delete);

	// Finish by binding the Lease middleware
	app.param('leaseId', leases.leaseByID);
};
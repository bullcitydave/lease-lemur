'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var tenants = require('../../app/controllers/tenants');

	// Tenants Routes
	app.route('/tenants')
		.get(tenants.list)
		.post(users.requiresLogin, tenants.create);
	
	app.route('/tenants/:tenantId')
		.get(tenants.read)
		.put(users.requiresLogin, tenants.hasAuthorization, tenants.update)
	    .delete(users.requiresLogin, tenants.hasAuthorization, tenants.delete);

	// Finish by binding the Tenant middleware
	app.param('tenantId', tenants.tenantByID);
};
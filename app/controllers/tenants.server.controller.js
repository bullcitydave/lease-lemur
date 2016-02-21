'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Tenant = mongoose.model('Tenant'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Tenant already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Tenant
 */
exports.create = function(req, res) {
	var tenant = new Tenant(req.body);
	tenant.user = req.user;

	tenant.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * Show the current Tenant
 */
exports.read = function(req, res) {
	res.jsonp(req.tenant);
};

/**
 * Update a Tenant
 */
exports.update = function(req, res) {
	var tenant = req.tenant;

	tenant = _.extend(tenant, req.body);

	tenant.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * Delete an Tenant
 */
exports.delete = function(req, res) {
	var tenant = req.tenant;

	tenant.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * List of Tenants
 */
exports.list = function(req, res) {
	Tenant.find().sort('-created').populate('user', 'displayName').exec(function(err, tenants) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tenants);
		}
	});
};

/**
 * Tenant middleware
 */
exports.tenantByID = function(req, res, next, id) {
	Tenant.findById(id).populate('user', 'displayName').exec(function(err, tenant) {
		if (err) return next(err);
		if (!tenant) return next(new Error('Failed to load Tenant ' + id));
		req.tenant = tenant;
		next();
	});
};

/**
 * Tenant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tenant.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
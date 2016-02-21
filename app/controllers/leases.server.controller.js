'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Lease = mongoose.model('Lease'),
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
				message = 'Lease already exists';
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
 * Create a Lease
 */
exports.create = function(req, res) {
	var lease = new Lease(req.body);
	lease.user = req.user;

	lease.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lease);
		}
	});
};

/**
 * Show the current Lease
 */
exports.read = function(req, res) {
	res.jsonp(req.lease);
};

/**
 * Update a Lease
 */
exports.update = function(req, res) {
	var lease = req.lease;

	lease = _.extend(lease, req.body);

	lease.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lease);
		}
	});
};

/**
 * Delete an Lease
 */
exports.delete = function(req, res) {
	var lease = req.lease;

	lease.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lease);
		}
	});
};

/**
 * List of Leases
 */
exports.list = function(req, res) {
	Lease.find().sort('-created').populate('user', 'displayName').exec(function(err, leases) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(leases);
		}
	});
};

/**
 * Lease middleware
 */
exports.leaseByID = function(req, res, next, id) {
	Lease.findById(id).populate('user', 'displayName').exec(function(err, lease) {
		if (err) return next(err);
		if (!lease) return next(new Error('Failed to load Lease ' + id));
		req.lease = lease;
		next();
	});
};

/**
 * Lease authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.lease.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
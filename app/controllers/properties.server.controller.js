'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Property = mongoose.model('Property'),
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
				message = 'Property already exists';
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
 * Create a Property
 */
exports.create = function(req, res) {
	var property = new Property(req.body);
	property.user = req.user;

	property.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	});
};

/**
 * Show the current Property
 */
exports.read = function(req, res) {
	res.jsonp(req.property);
};

/**
 * Update a Property
 */
exports.update = function(req, res) {
	var property = req.property;

	property = _.extend(property, req.body);

	property.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	});
};

/**
 * Delete an Property
 */
exports.delete = function(req, res) {
	var property = req.property;

	property.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(property);
		}
	});
};

/**
 * List of Properties
 */
exports.list = function(req, res) {
	Property.find().sort('-created').populate('user', 'displayName').exec(function(err, properties) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(properties);
		}
	});
};

/**
 * Property middleware
 */
exports.propertyByID = function(req, res, next, id) {
	Property.findById(id).populate('user', 'displayName').exec(function(err, property) {
		if (err) return next(err);
		if (!property) return next(new Error('Failed to load Property ' + id));
		req.property = property;
		next();
	});
};

/**
 * Property authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.property.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
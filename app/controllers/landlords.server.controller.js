'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Landlord = mongoose.model('Landlord'),
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
				message = 'Landlord already exists';
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
 * Create a Landlord
 */
exports.create = function(req, res) {
	var landlord = new Landlord(req.body);
	landlord.user = req.user;

	landlord.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(landlord);
		}
	});
};

/**
 * Show the current Landlord
 */
exports.read = function(req, res) {
	res.jsonp(req.landlord);
};

/**
 * Update a Landlord
 */
exports.update = function(req, res) {
	var landlord = req.landlord;

	landlord = _.extend(landlord, req.body);

	landlord.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(landlord);
		}
	});
};

/**
 * Delete an Landlord
 */
exports.delete = function(req, res) {
	var landlord = req.landlord;

	landlord.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(landlord);
		}
	});
};

/**
 * List of Landlords
 */
exports.list = function(req, res) {
	Landlord.find().sort('-created').populate('user', 'displayName').exec(function(err, landlords) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(landlords);
		}
	});
};

/**
 * Landlord middleware
 */
exports.landlordByID = function(req, res, next, id) {
	Landlord.findById(id).populate('user', 'displayName').exec(function(err, landlord) {
		if (err) return next(err);
		if (!landlord) return next(new Error('Failed to load Landlord ' + id));
		req.landlord = landlord;
		next();
	});
};

/**
 * Landlord authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.landlord.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
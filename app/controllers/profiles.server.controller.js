'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Profile = mongoose.model('Profile'),
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
				message = 'Profile already exists';
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
 * Create a Profile
 */
exports.create = function(req, res) {
	var profile = new Profile(req.body);
	profile.user = req.user;

	profile.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(profile);
		}
	});
};

/**
 * Show the current Profile
 */
exports.read = function(req, res) {
	res.jsonp(req.profile);
};

/**
 * Update a Profile
 */
exports.update = function(req, res) {
	var profile = req.profile;

	profile = _.extend(profile, req.body);

	profile.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(profile);
		}
	});
};

/**
 * Delete an Profile
 */
exports.delete = function(req, res) {
	var profile = req.profile;

	profile.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(profile);
		}
	});
};

/**
 * List of Profiles
 */
exports.list = function(req, res) {
	Profile.find().sort('-created').populate('user', 'displayName').exec(function(err, profiles) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(profiles);
		}
	});
};

/**
 * Profile middleware
 */
exports.profileByID = function(req, res, next, id) {
	Profile.findById(id).populate('user', 'displayName').exec(function(err, profile) {
		if (err) return next(err);
		if (!profile) return next(new Error('Failed to load Profile ' + id));
		req.profile = profile;
		next();
	});
};

/**
 * Profile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profile.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
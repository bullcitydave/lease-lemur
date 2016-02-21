'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Landlord Schema
 */
var LandlordSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Landlord name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Landlord', LandlordSchema);
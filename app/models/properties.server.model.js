'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Property Schema
 */
var PropertySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Property name',
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

mongoose.model('Property', PropertySchema);
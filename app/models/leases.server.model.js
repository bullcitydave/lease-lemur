'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Lease Schema
 */
var LeaseSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	tenant : {
		// TODO ideally
		// type: Schema.ObjectId,
		// ref: 'Tenant',
		type: String,
		trim: true,
		required: 'Please complete Tenant name',
	},
	property : {
		// TODO ideally
		// type: Schema.ObjectId,
		// ref: 'Property',
		type: String,
		trim: true,
		required: 'Please complete property name'
	},
	landlord : {
		// TODO ideally
		// is a property of model Property
		// type: Schema.ObjectId,
		// ref: 'Landlord',
		type: String,
		trim: true,
		required: 'Please complete property name',
	},
	startDate : {
		type: Date,
		min: Date('2015-01-01'),
		max: Date('2045-01-01')
	},
	endDate : {
		type: Date,
		min: Date('2015-01-01'),
		max: Date('2045-01-01')
	},
	leasePeriods : [
		{
			startDate : {
				type: Date,
				min: Date('2015-01-01'),
				max: Date('2045-01-01')
			},
			endDate : {
				type: Date,
				min: Date('2015-01-01'),
				max: Date('2045-01-01')
			},
		  monthlyRate : {
				type: Number,
			}
		}
	]
});

mongoose.model('Lease', LeaseSchema);

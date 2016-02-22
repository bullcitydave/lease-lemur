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
		min: new Date('2015-01-01'),
		max: new Date('2045-01-01')
	},
	endDate : {
		type: Date,
		min: new Date('2015-01-01'),
		max: new Date('2045-01-01')
	},
	leasePeriods : [
		{
			startDate : {
				type: Date,
				min: new Date('2015-01-01'),
				max: new Date('2045-01-01')
			},
			endDate : {
				type: Date,
				min: new Date('2015-01-01'),
				max: new Date('2045-01-01')
			},
		  monthlyRate : {
				type: Number,
				min: 100,
				max: 99999
			}
		}
	]
});

// LeaseSchema.path('startDate').validate(function(value) {
// 	console.log('date: ', value, ' and Date is ', Date('2015-01-01'));
//   if (value < Date('2015-01-01')) return next(new Error('date bad'));
// });

mongoose.model('Lease', LeaseSchema);

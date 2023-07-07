const { Schema, model } = require('mongoose');

const AddressGeoSchema = new Schema(
	{
		lat: {
			type: String,
			required: [true, 'Please enter a geo latitude'],
		},
		lng: {
			type: String,
			required: [true, 'Please enter a geo longitude'],
		},
	},
	{ _id: false, versionKey: false }
);

const AddressSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		street: {
			type: String,
			required: [true, 'Please enter a address street'],
		},
		suite: {
			type: String,
			required: [true, 'Please enter a address suite'],
		},
		city: {
			type: String,
			required: [true, 'Please enter a address city'],
		},
		zipcode: {
			type: String,
			required: [true, 'Please enter a address zipcode'],
		},
		geo: AddressGeoSchema,
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Address', AddressSchema);

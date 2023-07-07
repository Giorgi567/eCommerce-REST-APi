const { Schema, model } = require('mongoose');

const BrandSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Brand', BrandSchema);

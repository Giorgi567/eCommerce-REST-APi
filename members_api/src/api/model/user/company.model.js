const { Schema, model } = require('mongoose');

const CompanySchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			required: [true, 'Please enter a company name'],
		},
		catchPhrase: {
			type: String,
			required: [true, 'Please enter a company catch phrase'],
		},
		bs: {
			type: String,
			required: [true, 'Please enter a company bs'],
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Company', CompanySchema);

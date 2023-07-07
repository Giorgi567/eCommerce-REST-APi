const { Schema, model } = require('mongoose');

const CategorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		sub_categories: {
			type: [Schema.Types.ObjectId],
			default: [],
		},
	},
	{ timestamps: false, versionKey: false }
);

module.exports = model('Category', CategorySchema);

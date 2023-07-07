const { Schema, model } = require('mongoose');

const SubCategorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		parent_category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	},
	{ timestamps: false, versionKey: false }
);

module.exports = model('Sub_Category', SubCategorySchema);

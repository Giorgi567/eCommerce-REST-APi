const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		brand: {
			type: Schema.Types.ObjectId,
			ref: 'Brand',
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		sub_category: {
			type: Schema.Types.ObjectId,
			ref: 'Sub_Category',
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Product', ProductSchema);

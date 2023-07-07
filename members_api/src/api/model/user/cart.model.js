const { Schema, model } = require('mongoose');

const UserCartItemSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		requested_quantity: {
			type: Number,
			required: true,
		},
	},
	{ _id: false, versionKey: false }
);

const UserCartSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: {
			type: [UserCartItemSchema],
			default: [],
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Users_Cart', UserCartSchema);

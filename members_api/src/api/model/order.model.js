const { Schema, model } = require('mongoose');

const OrderItemSchema = new Schema(
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
		amount: {
			type: Number,
			required: true,
		},
	},
	{ _id: false, versionKey: false }
);

const OrderSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: {
			type: [OrderItemSchema],
			required: true,
			validate: [
				function (value) {
					return value.length > 0;
				},
				'Order Items is empty',
			],
		},
		shipping: {
			personal_id: {
				type: String,
				required: true,
			},
			first_name: {
				type: String,
				required: true,
			},
			last_name: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			method: {
				enum: ['TAKE_IT_TO_THE_STORE', 'ON_SITE_DELIVERY', 'PICK_UP_AT_THE_STORE_NEXT_DAY', 'EXPRESS_DELIVERY'],
				type: String,
				required: true,
			},
			city: String,
			address: String,
		},
		status: {
			type: String,
			enum: ['CANCELED', 'IN_PROCESS', 'COMPLETED'],
			default: 'IN_PROCESS',
		},
		total_price: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Order', OrderSchema);

const { Schema, model } = require('mongoose');

const UserFavoriteProductItemSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		save_date: {
			type: Date,
			required: true,
		},
	},
	{ _id: false, versionKey: false }
);

const UserFavoritesSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		products: {
			type: [UserFavoriteProductItemSchema],
			default: [],
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = model('Users_Favorite', UserFavoritesSchema);

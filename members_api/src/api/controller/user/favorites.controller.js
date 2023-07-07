const UserFavorites = require('../../model/user/favorites.model');
const Product = require('../../model/product.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get user favorite items
// @route       GET /api/users/me/favorites
// @access      Private
exports.getUserFavorites = async (request, response) => {
	const user_favorites = await UserFavorites.findOne({ user: request.user._id }).populate({
		path: 'products.product',
		select: ['name', 'image', 'price', 'quantity', 'brand', 'category', 'sub_category', 'disabled'],
		populate: [
			{
				path: 'brand',
				model: 'Brand',
				select: ['name'],
			},
			{
				path: 'category',
				model: 'Category',
				select: ['name'],
			},
			{
				path: 'sub_category',
				model: 'Sub_Category',
				select: ['name'],
			},
		],
	});

	response.status(200).json({ success: true, user_favorites: user_favorites });
};

// @desc        Add product in user favorite products
// @route       POST /api/users/me/favorites/products/:id
// @access      Private
exports.addProductInUserFavoriteProducts = async (request, response, next) => {
	const requested_product = await Product.findById(request.params.id);

	if (!requested_product) {
		return next(new ErrorResponseBuilder('Product not found', 404));
	}

	if (requested_product.disabled) {
		return next(new ErrorResponseBuilder('The product is disabled', 400));
	}

	const user_favorites = await UserFavorites.findOne({ user: request.user._id });

	const current_products = [...user_favorites.products];

	let in_favorite_products = current_products.length
		? current_products.some((product_item) => String(product_item.product) === String(request.params.id))
		: false;

	if (in_favorite_products) {
		return next(new ErrorResponseBuilder('The product already in favorite products', 400));
	} else {
		current_products.unshift({
			product: requested_product._id,
			save_date: new Date(Date.now()),
		});
	}

	const updated_user_favorites = await UserFavorites.findByIdAndUpdate(
		user_favorites._id,
		{ products: current_products },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_favorites: updated_user_favorites });
};

// @desc        Remove product from use favorite products
// @route       DELETE /api/users/me/favorites/products/:id
// @access      Private
exports.removeProductFromUserFavoriteProducts = async (request, response) => {
	const user_favorites = await UserFavorites.findOne({ user: request.user._id });

	let current_products = [...user_favorites.products];

	let in_favorite_products = current_products.length
		? current_products.some((product_item) => String(product_item.product) === String(request.params.id))
		: false;

	if (in_favorite_products) {
		current_products = current_products.filter(
			(product_item) => String(product_item.product) !== String(request.params.id)
		);
	} else {
		return next(new ErrorResponseBuilder('The product is not in favorite products', 400));
	}

	const updated_user_favorites = await UserFavorites.findByIdAndUpdate(
		user_favorites._id,
		{ products: current_products },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_favorites: updated_user_favorites });
};

// @desc        Clear user favorite products
// @route       PUT /api/users/me/favorites/products/clear
// @access      Private
exports.clearUserFavoriteProducts = async (request, response) => {
	const user_favorites = await UserFavorites.findOne({ user: request.user._id });

	const updated_user_favorites = await UserFavorites.findByIdAndUpdate(
		user_favorites._id,
		{ products: [] },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_favorites: updated_user_favorites });
};

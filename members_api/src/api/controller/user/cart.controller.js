const UserCart = require('../../model/user/cart.model');
const Product = require('../../model/product.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get user cart
// @route       GET /api/users/me/cart
// @access      Private
exports.getUserCart = async (request, response) => {
	const user_cart = await UserCart.findOne({ user: request.user._id }).populate({
		path: 'items.product',
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

	response.status(200).json({ success: true, user_cart: user_cart });
};

// @desc        Add item in user cart
// @route       POST /api/users/me/cart/:id
// @access      Private
exports.addItemInUserCart = async (request, response, next) => {
	const requested_product = await Product.findById(request.params.id);

	if (!requested_product) {
		return next(new ErrorResponseBuilder('Product not found', 404));
	}

	if (requested_product.disabled) {
		return next(new ErrorResponseBuilder('The product is disabled', 400));
	}

	if (requested_product.quantity < request.body.requested_quantity) {
		return next(new ErrorResponseBuilder('The quantity of the product should not be less than the demand', 400));
	}

	const user_cart = await UserCart.findOne({ user: request.user._id });

	const current_items = [...user_cart.items];

	let in_cart_items = current_items.length
		? current_items.some((cart_item) => String(cart_item.product) === String(request.params.id))
		: false;

	if (in_cart_items) {
		const selected_item_index = current_items.findIndex(
			(cart_item) => String(cart_item.product) === String(request.params.id)
		);

		current_items[selected_item_index].requested_quantity = request.body.requested_quantity;
	} else {
		current_items.unshift({
			product: requested_product._id,
			requested_quantity: request.body.requested_quantity,
		});
	}

	const updated_user_cart = await UserCart.findByIdAndUpdate(
		user_cart._id,
		{ items: current_items },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_cart: updated_user_cart });
};

// @desc        Remove item from use cart
// @route       DELETE /api/users/me/cart/:id
// @access      Private
exports.removeItemFromUserCart = async (request, response) => {
	const user_cart = await UserCart.findOne({ user: request.user._id });

	let current_items = [...user_cart.items];

	let in_cart_items = current_items.length
		? current_items.some((cart_item) => String(cart_item.product) === String(request.params.id))
		: false;

	if (!in_cart_items) {
		return next(new ErrorResponseBuilder('Product not found in cart', 400));
	}

	current_items = current_items.length
		? current_items.filter((cart_item) => String(cart_item.product) !== String(request.params.id))
		: [];

	const updated_user_cart = await UserCart.findByIdAndUpdate(
		user_cart._id,
		{ items: current_items },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_cart: updated_user_cart });
};

// @desc        Clear user cart
// @route       PUT /api/users/me/cart/clear
// @access      Private
exports.clearUserCart = async (request, response) => {
	const user_cart = await UserCart.findOne({ user: request.user._id });

	const updated_user_cart = await UserCart.findByIdAndUpdate(
		user_cart._id,
		{ items: [] },
		{
			new: true,
			runValidators: true,
		}
	);

	response.status(200).json({ success: true, user_cart: updated_user_cart });
};

const Order = require("../model/order.model");
const Product = require("../model/product.model");
const UserCart = require("../model/user/cart.model");
const ErrorResponseBuilder = require("../helper/error-response-builder.helper");

// @desc        Get orders
// @route       GET /api/orders
// @access      Private
exports.getAll = async (request, response) => {
  const orders = await Order.find();

  response.status(200).json({ success: true, orders: orders });
};

// @desc        Get order by ID
// @route       GET /api/orders/:id
// @access      Private
exports.getOne = async (request, response, next) => {
  const order = await Order.findById(request.params.id);

  if (!order) {
    return next(new ErrorResponseBuilder("Order not found", 404));
  }

  response.status(200).json({ success: true, order: order });
};

// @desc        Get user orders
// @route       GET /api/users/me/orders
// @access      Private
exports.getUserOrders = async (request, response) => {
  const orders = await Order.find({ user: request.user._id });

  response.status(200).json({ success: true, orders: orders });
};

// @desc        Create order
// @route       POST /api/orders
// @access      Private
exports.create = async (request, response, next) => {
  let every_product_in_stock = true;
  let every_product_is_active = true;
  let every_product_amount_is_active = true;

  for (const order_item of request.body.items) {
    const populated_product = await Product.findById(order_item.product);

    if (!populated_product) {
      return next(new ErrorResponseBuilder("Some product not found", 404));
    }

    if (
      every_product_in_stock &&
      order_item.requested_quantity > populated_product.quantity
    ) {
      every_product_in_stock = false;
    }

    if (every_product_is_active && populated_product.disabled) {
      every_product_is_active = false;
    }

    if (
      every_product_amount_is_active &&
      order_item.amount !== populated_product.price
    ) {
      every_product_amount_is_active = false;
    }
  }

  if (!every_product_in_stock) {
    return next(new ErrorResponseBuilder("Stock problem", 400));
  }

  if (!every_product_is_active) {
    return next(new ErrorResponseBuilder("Some product is disabled", 400));
  }

  if (!every_product_amount_is_active) {
    return next(new ErrorResponseBuilder("Prices is changed", 400));
  }

  const calculated_total_price = request.body.items.reduce(
    (accumulator, order_item) =>
      accumulator + order_item.amount * order_item.requested_quantity,
    0
  );

  if (
    +parseFloat(calculated_total_price).toFixed(2) !==
    +parseFloat(request.body.total_price).toFixed(2)
  ) {
    return next(new ErrorResponseBuilder("Total price dont match", 400));
  }

  const new_order = await Order.create({
    ...request.body,
    user: request.user._id,
  });

  const user_cart = await UserCart.findOne({ user: request.user._id });

  const order_products_ids = new_order.items.map((order_item) =>
    String(order_item.product)
  );

  const updated_cart_items = [...user_cart.items].filter(
    (cart_item) => !order_products_ids.includes(String(cart_item.product))
  );

  await UserCart.findByIdAndUpdate(
    user_cart._id,
    { items: updated_cart_items },
    { new: true, runValidators: true }
  );

  for (const order_item of new_order.items) {
    const order_product = await Product.findById(order_item.product);

    await Product.findByIdAndUpdate(order_product._id, {
      quantity: order_product.quantity - order_item.requested_quantity,
    });
  }

  response.status(200).json({ success: true, order: new_order });
};

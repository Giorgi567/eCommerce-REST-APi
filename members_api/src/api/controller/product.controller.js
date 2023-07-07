const Product = require('../model/product.model');
const Brand = require('../model/brand.model');
const Category = require('../model/menu/category.model');
const SubCategory = require('../model/menu/sub-category.model');
const ErrorResponseBuilder = require('../helper/error-response-builder.helper');

// @desc        Get products
// @route       GET /api/products
// @access      Public
exports.getAll = async (request, response) => {
	const products = await Product.find();

	response.status(200).json({ success: true, products: products });
};

// @desc        Get product by ID
// @route       GET /api/products/:id
// @access      Public
exports.getOne = async (request, response, next) => {
	const product = await Product.findById(request.params.id)
		.populate('brand', 'name')
		.populate({
			path: 'category',
			select: ['name', 'sub_categories'],
			populate: {
				path: 'sub_categories',
				model: 'Sub_Category',
				select: ['name'],
			},
		})
		.populate({ path: 'sub_category', select: ['name'] });

	if (!product) {
		return next(new ErrorResponseBuilder('Product not found', 404));
	}

	response.status(200).json({ success: true, product: product });
};

// @desc        Create product
// @route       POST /api/products
// @access      Private
exports.create = async (request, response, next) => {
	const category = await Category.findById(request.body.category);

	if (!category) {
		return next(new ErrorResponseBuilder('Product category not found', 404));
	}

	const sub_category = await SubCategory.findById(request.body.sub_category);

	if (!sub_category) {
		return next(new ErrorResponseBuilder('Product sub category not found', 404));
	}

	const brand = await Brand.findById(request.body.brand);

	if (!brand) {
		return next(new ErrorResponseBuilder('Product brand not found', 404));
	}

	const product = await Product.create(request.body);

	response.status(200).json({ success: true, product: product });
};

// @desc        Update product by ID
// @route       PUT /api/products/:id
// @access      Private
exports.updateOne = async (request, response, next) => {
	const request_product = await Product.findById(request.params.id);

	if (!request_product) {
		return next(new ErrorResponseBuilder('Product not found', 404));
	}

	if (request.body.category && String(request.body.category) !== String(request_product.category)) {
		const category = await Category.findById(request.body.category);

		if (!category) {
			return next(new ErrorResponseBuilder('Product category not found', 404));
		}
	}

	if (request.body.sub_category && String(request.body.sub_category) !== String(request_product.sub_category)) {
		const sub_category = await SubCategory.findById(request.body.sub_category);

		if (!sub_category) {
			return next(new ErrorResponseBuilder('Product sub category not found', 404));
		}
	}

	if (request.body.brand && String(request.body.brand) !== String(request_product.brand)) {
		const brand = await Brand.findById(request.body.brand);

		if (!brand) {
			return next(new ErrorResponseBuilder('Product brand not found', 404));
		}
	}

	const updated_product = await Product.findByIdAndUpdate(request_product._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, product: updated_product });
};

// @desc        Delete product by ID
// @route       DELETE /api/products/:id
// @access      Private
exports.deleteOne = async (request, response) => {
	const request_product = await Product.findById(request.params.id);

	if (!request_product) {
		return next(new ErrorResponseBuilder('Product not found', 404));
	}

	await Product.findByIdAndDelete(request_product._id);

	response.status(200).json({ success: true });
};

const Brand = require('../model/brand.model');
const Product = require('../model/product.model');
const ErrorResponseBuilder = require('../helper/error-response-builder.helper');

// @desc        Get brands
// @route       GET /api/brands
// @access      Public
exports.getAll = async (request, response) => {
	const brands = await Brand.find();

	response.status(200).json({ success: true, brands: brands });
};

// @desc        Get brand by ID
// @route       GET /api/brands/:id
// @access      Public
exports.getOne = async (request, response, next) => {
	const brand = await Brand.findById(request.params.id);

	if (!brand) {
		return next(new ErrorResponseBuilder('Brand not found', 404));
	}

	response.status(200).json({ success: true, brand: brand });
};

// @desc        Create brand
// @route       POST /api/brands
// @access      Private
exports.create = async (request, response) => {
	const brand = await Brand.create(request.body);

	response.status(200).json({ success: true, brand: brand });
};

// @desc        Update brand by ID
// @route       PUT /api/brands/:id
// @access      Private
exports.updateOne = async (request, response, next) => {
	const request_brand = await Brand.findById(request.params.id);

	if (!request_brand) {
		return next(new ErrorResponseBuilder('Brand not found', 404));
	}

	const updated_brand = await Brand.findByIdAndUpdate(request_brand._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, brand: updated_brand });
};

// @desc        Delete brand by ID
// @route       DELETE /api/brands/:id
// @access      Private
exports.deleteOne = async (request, response, next) => {
	const brand = await Brand.findById(request.params.id);

	if (!brand) {
		return next(new ErrorResponseBuilder('Brand not found', 404));
	}

	await Brand.findByIdAndDelete(brand._id);

	await Product.deleteMany({ brand: brand._id });

	response.status(200).json({ success: true });
};

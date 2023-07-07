const Category = require("../../model/menu/category.model");
const SubCategory = require("../../model/menu/sub-category.model");
const Product = require("../../model/product.model");
const ErrorResponseBuilder = require("../../helper/error-response-builder.helper");

// @desc        Get categories
// @route       GET /api/menu/categories
// @access      Public
exports.getCategories = async (request, response) => {
  const categories = await Category.find();

  response.status(200).json({ success: true, categories: categories });
};

// @desc        Get category by ID
// @route       GET /api/menu/categories/:id
// @access      Public
exports.getCategory = async (request, response, next) => {
  const category = await Category.findById(request.params.id);

  if (!category) {
    return next(new ErrorResponseBuilder("Category not found", 404));
  }

  response.status(200).json({ success: true, category: category });
};

// @desc        Create category
// @route       POST /api/menu/categories
// @access      Private
exports.createCategory = async (request, response) => {
  const category = await Category.create(request.body);

  response.status(200).json({ success: true, category: category });
};

// @desc        Update category by ID
// @route       PUT /api/menu/categories/:id
// @access      Private
exports.updateCategory = async (request, response, next) => {
  const request_category = await Category.findById(request.params.id);

  if (!request_category) {
    return next(new ErrorResponseBuilder("Category not found", 404));
  }

  const updated_category = await Category.findByIdAndUpdate(
    request_category._id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );

  response.status(200).json({ success: true, category: updated_category });
};

// @desc        Delete category by ID
// @route       DELETE /api/menu/categories/:id
// @access      Private
exports.deleteCategory = async (request, response, next) => {
  const category = await Category.findById(request.params.id);

  if (!category) {
    return next(new ErrorResponseBuilder("Category not found", 404));
  }

  await Category.findByIdAndDelete(category._id);

  await SubCategory.deleteMany({ parent_category: category._id });

  await Product.deleteMany({ category: category._id });

  response.status(200).json({ success: true });
};

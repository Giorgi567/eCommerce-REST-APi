const Category = require("../../model/menu/category.model");
const Product = require("../../model/product.model");

const SubCategory = require("../../model/menu/sub-category.model");
const ErrorResponseBuilder = require("../../helper/error-response-builder.helper");

// @desc        Get sub categories
// @route       GET /api/menu/sub_categories
// @access      Public
exports.getSubCategories = async (request, response) => {
  const sub_categories = await SubCategory.find();

  response.status(200).json({ success: true, sub_categories: sub_categories });
};

// @desc        Get sub category by ID
// @route       GET /api/menu/sub_categories/:id
// @access      Public
exports.getSubCategory = async (request, response, next) => {
  const sub_category = await SubCategory.findById(request.params.id);

  if (!sub_category) {
    return next(new ErrorResponseBuilder("Sub category not found", 404));
  }

  response.status(200).json({ success: true, sub_category: sub_category });
};

// @desc        Create sub category
// @route       POST /api/menu/sub_categories
// @access      Private
exports.createSubCategory = async (request, response, next) => {
  const parent_category = await Category.findById(request.body.parent_category);

  if (!parent_category) {
    return next(new ErrorResponseBuilder("Parent category not found", 404));
  }

  const sub_category = await SubCategory.create(request.body);

  parent_category.sub_categories.push(sub_category._id);

  parent_category.save();

  response.status(200).json({ success: true, sub_category: sub_category });
};

// @desc        Update sub category by ID
// @route       PUT /api/menu/sub_categories/:id
// @access      Private
exports.updateSubCategory = async (request, response, next) => {
  const request_sub_category = await SubCategory.findById(request.params.id);

  if (!request_sub_category) {
    return next(new ErrorResponseBuilder("Sub category not found", 404));
  }

  if (
    request.body.parent_category &&
    String(request.body.parent_category) !==
      String(request_sub_category.parent_category)
  ) {
    const current_parent_category = await Category.findById(
      request_sub_category.parent_category
    );

    if (!current_parent_category) {
      return next(
        new ErrorResponseBuilder("Current parent category not found", 404)
      );
    }

    const new_parent_category = await Category.findById(
      request.body.parent_category
    );

    if (!new_parent_category) {
      return next(
        new ErrorResponseBuilder("New parent category not found", 404)
      );
    }

    current_parent_category.sub_categories =
      current_parent_category.sub_categories.filter(
        (sub_category_id) =>
          String(sub_category_id) !== String(request_sub_category._id)
      );

    current_parent_category.save();

    new_parent_category.sub_categories.push(request_sub_category._id);

    new_parent_category.save();

    await Product.updateMany(
      { sub_category: request_sub_category._id },
      { category: new_parent_category._id },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  const updated_sub_category = await SubCategory.findByIdAndUpdate(
    request_sub_category._id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );

  response
    .status(200)
    .json({ success: true, sub_category: updated_sub_category });
};

// @desc        Delete sub category by ID
// @route       DELETE /api/menu/sub_categories/:id
// @access      Private
exports.deleteSubCategory = async (request, response, next) => {
  const sub_category = await SubCategory.findById(request.params.id);

  if (!sub_category) {
    return next(new ErrorResponseBuilder("Sub category not found", 404));
  }

  const parent_category = await Category.findById(sub_category.parent_category);

  if (!parent_category) {
    return next(new ErrorResponseBuilder("Parent category not found", 404));
  }

  parent_category.sub_categories = parent_category.sub_categories.filter(
    (sub_category_id) => String(sub_category_id) !== String(sub_category._id)
  );

  parent_category.save();

  await SubCategory.findByIdAndDelete(sub_category._id);

  await Product.deleteMany({ sub_category: sub_category._id });

  response.status(200).json({ success: true });
};

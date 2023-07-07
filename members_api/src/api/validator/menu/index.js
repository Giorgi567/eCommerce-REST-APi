const CreateCategoryValidator = require('./create-category.validator');
const CreateSubCategoryValidator = require('./create-sub-category.validator');
const UpdateCategoryValidator = require('./update-category.validator');
const UpdateSubCategoryValidator = require('./update-sub-category.validator');

const MenuItemsValidators = {
	CreateCategoryValidator,
	CreateSubCategoryValidator,
	UpdateCategoryValidator,
	UpdateSubCategoryValidator,
};

module.exports = { MenuItemsValidators };

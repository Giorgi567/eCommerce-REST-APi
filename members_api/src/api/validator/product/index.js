const CreateProductValidator = require('./create.validator');
const UpdateProductValidator = require('./update.validator');

const ProductValidators = {
	CreateProductValidator,
	UpdateProductValidator,
};

module.exports = { ProductValidators };

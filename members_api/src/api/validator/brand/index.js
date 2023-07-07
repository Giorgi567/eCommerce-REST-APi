const CreateBrandValidator = require('./create.validator');
const UpdateBrandValidator = require('./update.validator');

const BrandValidators = {
	CreateBrandValidator,
	UpdateBrandValidator,
};

module.exports = { BrandValidators };

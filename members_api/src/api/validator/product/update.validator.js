const { body, validationResult, matchedData } = require('express-validator');

const UpdateProductValidator = [
	body('name').optional().isString().not().isEmpty(),
	body('description').optional().isString().not().isEmpty(),
	body('image').optional().isString().not().isEmpty(),
	body('price').optional().isFloat().not().isEmpty(),
	body('quantity').optional().isInt().not().isEmpty(),
	body('brand').optional().isMongoId().not().isEmpty(),
	body('category').optional().isMongoId().not().isEmpty(),
	body('sub_category').optional().isMongoId().not().isEmpty(),
	body('disabled').optional().isBoolean().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = UpdateProductValidator;

const { body, validationResult, matchedData } = require('express-validator');

const CreateProductValidator = [
	body('name').isString().not().isEmpty(),
	body('description').isString().not().isEmpty(),
	body('image').isString().not().isEmpty(),
	body('price').isFloat().not().isEmpty(),
	body('quantity').isInt().not().isEmpty(),
	body('brand').isMongoId().not().isEmpty(),
	body('category').isMongoId().not().isEmpty(),
	body('sub_category').isMongoId().not().isEmpty(),
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

module.exports = CreateProductValidator;

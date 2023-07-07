const { body, validationResult, matchedData } = require('express-validator');

const CreateSubCategoryValidator = [
	body('name').isString().not().isEmpty(),
	body('parent_category').isMongoId().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = CreateSubCategoryValidator;

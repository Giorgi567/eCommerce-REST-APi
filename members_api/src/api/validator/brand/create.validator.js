const { body, validationResult, matchedData } = require('express-validator');

const CreateBrandValidator = [
	body('name').isString().not().isEmpty(),
	body('image').isString().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = CreateBrandValidator;

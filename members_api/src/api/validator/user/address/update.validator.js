const { body, validationResult, matchedData } = require('express-validator');

const UpdateUserAddressValidator = [
	body('street').optional().isString().not().isEmpty(),
	body('suite').optional().isString().not().isEmpty(),
	body('city').optional().isString().not().isEmpty(),
	body('zipcode').optional().isString().not().isEmpty(),
	body('geo').optional().isObject().not().isEmpty(),
	body('geo.lat').optional().isString().not().isEmpty(),
	body('geo.lng').optional().isString().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = UpdateUserAddressValidator;

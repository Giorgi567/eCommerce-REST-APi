const { body, validationResult, matchedData } = require('express-validator');

const CreateUserAddressValidator = [
	body('street').isString().not().isEmpty(),
	body('suite').isString().not().isEmpty(),
	body('city').isString().not().isEmpty(),
	body('zipcode').isString().not().isEmpty(),
	body('geo').isObject().not().isEmpty(),
	body('geo.lat').isString().not().isEmpty(),
	body('geo.lng').isString().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = CreateUserAddressValidator;

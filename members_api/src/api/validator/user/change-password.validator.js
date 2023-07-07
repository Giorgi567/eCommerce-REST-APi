const { body, validationResult, matchedData } = require('express-validator');

const ChangeUserPasswordValidator = [
	body('currentPassword').isString().not().isEmpty(),
	body('newPassword').isString().not().isEmpty().isLength({ min: 6, max: 30 }),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = ChangeUserPasswordValidator;

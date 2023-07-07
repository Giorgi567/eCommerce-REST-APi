const { body, validationResult } = require('express-validator');

const UserRoleValidator = [
	body('role').optional().isString().not().isEmpty().isIn(['USER']),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		return next();
	},
];

module.exports = UserRoleValidator;

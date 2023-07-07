const { body, validationResult } = require('express-validator');

const AdminUserRoleValidator = [
	body('role').isString().not().isEmpty().isIn(['USER', 'ADMIN']),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		return next();
	},
];

module.exports = AdminUserRoleValidator;

const { body, validationResult } = require('express-validator');

const AddItemInUserCartValidator = [
	body('requested_quantity').isInt().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		return next();
	},
];

module.exports = { AddItemInUserCartValidator };

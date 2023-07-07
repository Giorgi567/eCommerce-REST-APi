const { body, validationResult, matchedData } = require('express-validator');

const User = require('../../model/user/user.model');

const UpdateUserValidator = [
	body('name').optional().isString().not().isEmpty(),

	body('username')
		.optional()
		.isString()
		.not()
		.isEmpty()
		.custom((value) => {
			return User.findOne({ username: value }).then((user) => {
				if (user) {
					return Promise.reject('Username already in use');
				}
			});
		}),

	body('email')
		.optional()
		.isString()
		.not()
		.isEmpty()
		.matches(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
		.custom((value) => {
			return User.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject('E-mail already in use');
				}
			});
		}),

	body('password').optional().isString().not().isEmpty().isLength({ min: 6, max: 30 }),
	body('phone').optional().isString().not().isEmpty(),
	body('website').optional().isString().not().isEmpty(),
	body('role').optional().isString().not().isEmpty().isIn(['USER', 'ADMIN']),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = UpdateUserValidator;

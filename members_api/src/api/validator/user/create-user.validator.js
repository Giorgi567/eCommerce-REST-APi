const { body, validationResult, matchedData } = require('express-validator');

const User = require('../../model/user/user.model');

const CreateUserValidator = [
	body('name').isString().not().isEmpty(),

	body('username')
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

	body('password').isString().not().isEmpty().isLength({ min: 6, max: 30 }),
	body('phone').isString().not().isEmpty(),
	body('website').isString().not().isEmpty(),
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

module.exports = CreateUserValidator;

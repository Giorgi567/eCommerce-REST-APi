const { body, validationResult, matchedData } = require('express-validator');

const CreateOrderValidator = [
	body('items').isArray().not().isEmpty(),

	body('items.*.product').isMongoId().not().isEmpty(),
	body('items.*.requested_quantity').isInt().not().isEmpty(),
	body('items.*.amount').isFloat().not().isEmpty(),

	body('shipping').isObject().not().isEmpty(),
	body('shipping.personal_id').isString().not().isEmpty(),
	body('shipping.first_name').isString().not().isEmpty(),
	body('shipping.last_name').isString().not().isEmpty(),
	body('shipping.email')
		.isString()
		.not()
		.isEmpty()
		.matches(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
	body('shipping.phone').isString().not().isEmpty(),
	body('shipping.method')
		.isIn(['TAKE_IT_TO_THE_STORE', 'ON_SITE_DELIVERY', 'PICK_UP_AT_THE_STORE_NEXT_DAY', 'EXPRESS_DELIVERY'])
		.not()
		.isEmpty(),
	body('shipping.city')
		.if(body('shipping.method').equals('ON_SITE_DELIVERY' || 'EXPRESS_DELIVERY'))
		.isString()
		.not()
		.isEmpty(),
	body('shipping.address')
		.if(body('shipping.method').equals('ON_SITE_DELIVERY' || 'EXPRESS_DELIVERY'))
		.isString()
		.not()
		.isEmpty(),

	body('status').optional().isIn(['IN_PROCESS']).not().isEmpty(),
	body('total_price').isFloat().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = { CreateOrderValidator };

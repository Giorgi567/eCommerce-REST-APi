const { Router } = require('express');
const { getAll, create, getOne } = require('../controller/order.controller');
const { authorizeRolesProtect } = require('../middleware/authorize-roles-protect.middleware');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { MongoIDValidator } = require('../validator/mongo-id.validator');
const { CreateOrderValidator } = require('../validator/order/create.validator');

const router = Router();

router
	.route('/')
	.get(jwtProtect, authorizeRolesProtect(['ADMIN']), getAll)
	.post(jwtProtect, CreateOrderValidator, create);

router.route('/:id').get(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, getOne);

module.exports = router;

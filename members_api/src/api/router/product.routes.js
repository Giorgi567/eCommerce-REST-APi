const { Router } = require('express');
const { create, deleteOne, getAll, getOne, updateOne } = require('../controller/product.controller');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { ProductValidators } = require('../validator/product');
const { MongoIDValidator } = require('../validator/mongo-id.validator');
const { authorizeRolesProtect } = require('../middleware/authorize-roles-protect.middleware');

const router = Router();

router
	.route('/')
	.get(getAll)
	.post(jwtProtect, authorizeRolesProtect(['ADMIN']), ProductValidators.CreateProductValidator, create);

router
	.route('/:id')
	.get(MongoIDValidator, getOne)
	.put(
		jwtProtect,
		authorizeRolesProtect(['ADMIN']),
		MongoIDValidator,
		ProductValidators.UpdateProductValidator,
		updateOne
	)
	.delete(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, deleteOne);

module.exports = router;

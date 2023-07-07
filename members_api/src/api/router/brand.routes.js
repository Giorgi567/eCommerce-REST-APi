const { Router } = require('express');
const { create, deleteOne, getAll, getOne, updateOne } = require('../controller/brand.controller');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { BrandValidators } = require('../validator/brand');
const { MongoIDValidator } = require('../validator/mongo-id.validator');
const { authorizeRolesProtect } = require('../middleware/authorize-roles-protect.middleware');

const router = Router();

router
	.route('/')
	.get(getAll)
	.post(jwtProtect, authorizeRolesProtect(['ADMIN']), BrandValidators.CreateBrandValidator, create);

router
	.route('/:id')
	.get(MongoIDValidator, getOne)
	.put(
		jwtProtect,
		authorizeRolesProtect(['ADMIN']),
		MongoIDValidator,
		BrandValidators.UpdateBrandValidator,
		updateOne
	)
	.delete(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, deleteOne);

module.exports = router;

const { Router } = require('express');
const { create, deleteOne, getAll, getOne, updateOne } = require('../controller/post/post.controller');
const { PostValidators } = require('../validator/post');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { MongoIDValidator } = require('../validator/mongo-id.validator');

const router = Router();

router.route('/').get(getAll).post(jwtProtect, PostValidators.CreatePostValidator, create);

router
	.route('/:id')
	.get(MongoIDValidator, getOne)
	.put(jwtProtect, MongoIDValidator, PostValidators.UpdatePostValidator, updateOne)
	.delete(jwtProtect, MongoIDValidator, deleteOne);

module.exports = router;

const { Router } = require('express');
const { create, deleteOne, getPostComments, updateOne } = require('../controller/post/comment.controller');
const { PostCommentValidators } = require('../validator/post/comment');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { MongoIDValidator } = require('../validator/mongo-id.validator');

const router = Router();

router.route('/').post(jwtProtect, PostCommentValidators.CreatePostCommentValidator, create);

router.route('/post/:id').get(MongoIDValidator, getPostComments);

router
	.route('/:id')
	.put(jwtProtect, MongoIDValidator, PostCommentValidators.UpdatePostCommentValidator, updateOne)
	.delete(jwtProtect, MongoIDValidator, deleteOne);

module.exports = router;

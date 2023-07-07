const CreatePostCommentValidator = require('./create.validator');
const UpdatePostCommentValidator = require('./update.validator');

const PostCommentValidators = {
	CreatePostCommentValidator,
	UpdatePostCommentValidator,
};

module.exports = { PostCommentValidators };

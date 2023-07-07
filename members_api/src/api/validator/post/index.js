const CreatePostValidator = require('./create.validator');
const UpdatePostValidator = require('./update.validator');

const PostValidators = {
	CreatePostValidator,
	UpdatePostValidator,
};

module.exports = { PostValidators };

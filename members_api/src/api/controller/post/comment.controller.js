const Comment = require('../../model/post/comment.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get post comments
// @route       GET /api/comments/post/:post_id
// @access      Public
exports.getPostComments = async (request, response) => {
	const post_comments = await Comment.find({ album: request.params.album_id });

	response.status(200).json({ success: true, comments: post_comments });
};

// @desc        Create comment
// @route       POST /api/comments
// @access      Private
exports.create = async (request, response) => {
	const comment = await Comment.create({ ...request.body, user: request.user._id });

	response.status(200).json({ success: true, comment: comment });
};

// @desc        Update comment by ID
// @route       PUT /api/comments/:id
// @access      Private
exports.updateOne = async (request, response, next) => {
	const request_comment = await Comment.findById(request.params.id);

	if (!request_comment) {
		return next(new ErrorResponseBuilder('Comment not found', 404));
	}

	if (String(request_comment.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	const updated_comment = await Comment.findByIdAndUpdate(request_comment._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, comment: updated_comment });
};

// @desc        Delete comment by ID
// @route       DELETE /api/comments/:id
// @access      Private
exports.deleteOne = async (request, response, next) => {
	const request_comment = await Comment.findById(request.params.id);

	if (!request_comment) {
		return next(new ErrorResponseBuilder('Comment not found', 404));
	}

	if (String(request_comment.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Comment.findByIdAndDelete(request_comment._id);

	response.status(200).json({ success: true });
};

const Post = require('../../model/post/post.model');
const Comment = require('../../model/post/comment.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get posts
// @route       GET /api/posts
// @access      Public
exports.getAll = async (request, response) => {
	const posts = await Post.find();

	response.status(200).json({ success: true, posts: posts });
};

// @desc        Get post by ID
// @route       GET /api/posts/:id
// @access      Public
exports.getOne = async (request, response, next) => {
	const post = await Post.findById(request.params.id);

	if (!post) {
		return next(new ErrorResponseBuilder('Post not found', 404));
	}

	response.status(200).json({ success: true, post: post });
};

// @desc        Get user posts
// @route       GET /api/users/me/posts
// @access      Private
exports.getUserPosts = async (request, response) => {
	const user_posts = await Post.find({ user: request.user._id });

	response.status(200).json({ success: true, posts: user_posts });
};

// @desc        Create post
// @route       POST /api/posts
// @access      Private
exports.create = async (request, response) => {
	const post = await Post.create({ ...request.body, user: request.user._id });

	response.status(200).json({ success: true, post: post });
};

// @desc        Update post by ID
// @route       PUT /api/posts/:id
// @access      Private
exports.updateOne = async (request, response, next) => {
	const request_post = await Post.findById(request.params.id);

	if (!request_post) {
		return next(new ErrorResponseBuilder('Post not found', 404));
	}

	if (String(request_post.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	const updated_post = await Post.findByIdAndUpdate(request_post._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, post: updated_post });
};

// @desc        Delete post by ID
// @route       DELETE /api/posts/:id
// @access      Private
exports.deleteOne = async (request, response, next) => {
	const request_post = await Post.findById(request.params.id);

	if (!request_post) {
		return next(new ErrorResponseBuilder('Post not found', 404));
	}

	if (String(request_post.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Comment.deleteMany({ post: request_post._id });

	await Post.findByIdAndDelete(request_post._id);

	response.status(200).json({ success: true });
};

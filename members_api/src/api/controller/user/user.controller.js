const User = require('../../model/user/user.model');
const Todo = require('../../model/user/todo.model');
const Address = require('../../model/user/address.model');
const Company = require('../../model/user/company.model');
const Post = require('../../model/post/post.model');
const Comment = require('../../model/post/comment.model');
const Album = require('../../model/album/album.model');
const Photo = require('../../model/album/photo.model');
const UserFavorite = require('../../model/user/favorites.model');
const UserCart = require('../../model/user/cart.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');
const cloudinary = require('../../util/cloudinary.util');

// @desc        Get users
// @route       GET /api/users
// @access      Public
exports.getAll = async (request, response) => {
	const users = await User.find();

	response.status(200).json({ success: true, users: users });
};

// @desc        Get user by ID
// @route       GET /api/users/:id
// @access      Private
exports.getOne = async (request, response) => {
	const user = await User.findById(request.params.id);

	if (!user) {
		return next(new ErrorResponseBuilder('User not found', 404));
	}

	response.status(200).json({ success: true, user: user });
};

// @desc        Get current user
// @route       GET /api/users/me
// @access      Private
exports.getMe = async (request, response) => {
	response.status(200).json({ success: true, user: request.user });
};

// @desc        Update current user
// @route       PUT /api/users/me
// @access      Private
exports.updateMe = (request, response, next) => {
	User.findByIdAndUpdate(request.user._id, request.body, {
		new: true,
		runValidators: true,
	})
		.then((updated_user) => {
			response.status(200).json({ success: true, user: updated_user });
		})
		.catch(() => {
			return next(new ErrorResponseBuilder(error));
		});
};

// @desc        Change current user password
// @route       PUT /api/users/me/change_password
// @access      Private
exports.changePassword = async (request, response, next) => {
	if (!(await request.user.matchPassword(request.body.currentPassword))) {
		return next(new ErrorResponseBuilder('Password is incorrect', 400));
	}

	request.user.password = request.body.newPassword;

	request.user.save();

	response.status(200).json({ success: true });
};

// @desc        Update current user profile image
// @route       PUT /api/users/me/profile_image
// @access      Private
exports.changeProfileImage = async (request, response, next) => {
	let profile_image = null;

	await cloudinary.uploader
		.upload(request.body.photo, {
			public_id: `${request.user._id}`,
			width: 400,
			height: 400,
			upload_preset: 'users_profiles',
		})
		.then((image_data) => {
			profile_image = image_data.secure_url;
		})
		.catch(() => {
			return next(new ErrorResponseBuilder(`The user profile image could not be uploaded to the cloud`, 400));
		});

	User.findByIdAndUpdate(
		request.user._id,
		{ photo: profile_image },
		{
			new: true,
			runValidators: true,
		}
	)
		.then((updated_user) => {
			response.status(200).json({ success: true, photo: updated_user.photo });
		})
		.catch(() => {
			return next(new ErrorResponseBuilder(`An error occurred while updating the user`, 400));
		});
};

// @desc        Delete current user profile image
// @route       DELETE /api/users/me/profile_image
// @access      Private
exports.deleteProfileImage = async (request, response, next) => {
	if (request.user.photo && request.user.photo.includes('/members-api/users_profiles/')) {
		let destroy_status = false;

		await cloudinary.uploader.destroy(`members-api/users_profiles/${request.user._id}`).then((response) => {
			if (response.result && response.result === 'ok') {
				destroy_status = true;
			}
		});

		if (!destroy_status) {
			return next(
				new ErrorResponseBuilder(
					`The user profile image could not be deleted with public id of ${request.user._id}`,
					503
				)
			);
		}
	}

	request.user.photo = undefined;

	await request.user.save();

	response.status(200).json({ success: true });
};

// @desc        Create user
// @route       POST /api/users
// @access      Private
exports.create = (request, response, next) => {
	User.create(request.body)
		.then(async (new_user) => {
			await UserFavorite.create({ user: new_user._id });
			await UserCart.create({ user: new_user._id });

			response.status(200).json({ success: true, user: new_user });
		})
		.catch((error) => {
			return next(new ErrorResponseBuilder(error));
		});
};

// @desc        Update user by ID
// @route       PUT /api/users/:id
// @access      Private
exports.updateOne = async (request, response) => {
	const request_user = await User.findById(request.params.id);

	if (!request_user) {
		return next(new ErrorResponseBuilder('User not found', 404));
	}

	const updated_data = { ...request.body };

	if (updated_data.password && updated_data.password !== request_user.password) {
		request_user.password = updated_data.password;

		request_user.save();

		delete updated_data.password;
	}

	const user = await User.findByIdAndUpdate(request.params.id, updated_data, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, user: user });
};

// @desc        Delete user by ID
// @route       DELETE /api/users/:id
// @access      Private
exports.deleteOne = async (request, response, next) => {
	const request_user = await User.findById(request.params.id);

	if (!request_user) {
		return next(new ErrorResponseBuilder('User not found', 404));
	}

	await Address.deleteMany({ user: request_user._id });
	await Company.deleteMany({ user: request_user._id });
	await Todo.deleteMany({ user: request_user._id });

	await UserFavorite.findOneAndDelete({ user: request_user._id });
	await UserCart.findOneAndDelete({ user: request_user._id });

	const albums = await Album.find({ user: request_user._id });

	if (albums.length) {
		for (const album of albums) {
			await Photo.deleteMany({ album: album._id });
		}
	}

	await Album.deleteMany({ user: request_user._id });

	const posts = await Post.find({ user: request_user._id });

	if (posts.length) {
		for (const post of posts) {
			await Comment.deleteMany({ post: post._id });
		}
	}

	await Post.deleteMany({ user: request_user._id });

	await User.findByIdAndDelete(request_user._id);

	response.status(200).json({ success: true });
};

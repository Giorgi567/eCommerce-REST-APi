const Album = require('../../model/album/album.model');
const Photo = require('../../model/album/photo.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get albums
// @route       GET /api/albums
// @access      Public
exports.getAll = async (request, response) => {
	const albums = await Album.find();

	response.status(200).json({ success: true, albums: albums });
};

// @desc        Get album by ID
// @route       GET /api/albums/:id
// @access      Public
exports.getOne = async (request, response) => {
	const album = await Album.findById(request.params.id);

	if (!album) {
		return next(new ErrorResponseBuilder('Album not found', 404));
	}

	response.status(200).json({ success: true, album: album });
};

// @desc        Create album
// @route       POST /api/albums
// @access      Private
exports.create = async (request, response) => {
	const album = await Album.create({ ...request.body, user: request.user._id });

	response.status(200).json({ success: true, album: album });
};

// @desc        Get user albums
// @route       GET /api/users/me/albums
// @access      Private
exports.getUserAlbums = async (request, response) => {
	const user_albums = await Album.find({ user: request.user._id });

	response.status(200).json({ success: true, albums: user_albums });
};

// @desc        Update album by ID
// @route       PUT /api/albums/:id
// @access      Private
exports.updateOne = async (request, response, next) => {
	const request_album = await Album.findById(request.params.id);

	if (!request_album) {
		return next(new ErrorResponseBuilder('Album not found', 404));
	}

	if (String(request_album.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	const updated_album = await Album.findByIdAndUpdate(request_album._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, album: updated_album });
};

// @desc        Delete album by ID
// @route       DELETE /api/albums/:id
// @access      Private
exports.deleteOne = async (request, response) => {
	const request_album = await Album.findById(request.params.id);

	if (!request_album) {
		return next(new ErrorResponseBuilder('Album not found', 404));
	}

	if (String(request_album.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Photo.deleteMany({ album: request_album._id });

	await Album.findByIdAndDelete(request_album._id);

	response.status(200).json({ success: true });
};

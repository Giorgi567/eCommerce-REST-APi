const Photo = require('../../model/album/photo.model');
const Album = require('../../model/album/album.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get album photos
// @route       GET /api/photos/album/:id
// @access      Public
exports.getAlbumPhotos = async (request, response) => {
	const album_photos = await Photo.find({ album: request.params.id });

	response.status(200).json({ success: true, photos: album_photos });
};

// @desc        Create photo
// @route       POST /api/photos
// @access      Private
exports.create = async (request, response) => {
	const photo = await Photo.create(request.body);

	response.status(200).json({ success: true, photo: photo });
};

// @desc        Delete photo by ID
// @route       DELETE /api/photos/:id
// @access      Private
exports.deleteOne = async (request, response, next) => {
	const request_photo = await Photo.findById(request.params.id);

	if (!request_photo) {
		return next(new ErrorResponseBuilder('Photo not found', 404));
	}

	const photo_album = await Album.findById(request_photo.album);

	if (!photo_album) {
		return next(new ErrorResponseBuilder('Album not found', 404));
	}

	if (String(photo_album.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Photo.findByIdAndDelete(request.params.id);

	response.status(200).json({ success: true });
};

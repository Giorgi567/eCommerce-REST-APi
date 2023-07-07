const CreateAlbumValidator = require('./create.validator');
const UpdateAlbumValidator = require('./update.validator');

const AlbumValidators = {
	CreateAlbumValidator,
	UpdateAlbumValidator,
};

module.exports = { AlbumValidators };

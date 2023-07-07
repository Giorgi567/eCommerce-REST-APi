const { body, validationResult, matchedData } = require('express-validator');

const CreateAlbumPhotoValidator = [
	body('album').isMongoId().not().isEmpty(),
	body('title').isString().not().isEmpty(),
	body('url').isString().not().isEmpty(),
	body('thumbnail_url').isString().not().isEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(422).json({ success: false, errors: errors.array() });
		}

		request.body = matchedData(request, { locations: ['body'] });

		return next();
	},
];

module.exports = CreateAlbumPhotoValidator;

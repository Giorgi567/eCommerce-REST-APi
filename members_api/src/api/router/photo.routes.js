const { Router } = require('express');
const { create, deleteOne, getAlbumPhotos } = require('../controller/album/photo.controller');
const { AlbumPhotoValidators } = require('../validator/album/photo');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { MongoIDValidator } = require('../validator/mongo-id.validator');

const router = Router();

router.route('/').post(jwtProtect, AlbumPhotoValidators.CreateAlbumPhotoValidator, create);

router.route('/album/:id').get(MongoIDValidator, getAlbumPhotos);

router.route('/:id').delete(jwtProtect, MongoIDValidator, deleteOne);

module.exports = router;

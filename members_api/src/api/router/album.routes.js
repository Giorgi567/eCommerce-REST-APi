const { Router } = require('express');
const { create, deleteOne, getAll, getOne, updateOne } = require('../controller/album/album.controller');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');
const { AlbumValidators } = require('../validator/album');
const { MongoIDValidator } = require('../validator/mongo-id.validator');

const router = Router();

router.route('/').get(getAll).post(jwtProtect, AlbumValidators.CreateAlbumValidator, create);

router
	.route('/:id')
	.get(MongoIDValidator, getOne)
	.put(jwtProtect, MongoIDValidator, AlbumValidators.UpdateAlbumValidator, updateOne)
	.delete(jwtProtect, MongoIDValidator, deleteOne);

module.exports = router;

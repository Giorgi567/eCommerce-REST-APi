const { Schema, model } = require('mongoose');

const AlbumSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: [true, 'Please enter a title'],
		},
	},
	{ versionKey: false, timestamps: true }
);

module.exports = model('Album', AlbumSchema);

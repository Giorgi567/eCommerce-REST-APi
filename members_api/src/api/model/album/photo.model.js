const { Schema, model } = require('mongoose');

const PhotoSchema = new Schema(
	{
		album: {
			type: Schema.Types.ObjectId,
			ref: 'Album',
			required: true,
		},
		title: {
			type: String,
			required: [true, 'Please enter a title'],
		},
		url: {
			type: String,
			required: [true, 'Please enter a url'],
		},
		thumbnail_url: {
			type: String,
			required: [true, 'Please enter a thumbnail url'],
		},
	},
	{ versionKey: false, timestamps: true }
);

module.exports = model('Photo', PhotoSchema);

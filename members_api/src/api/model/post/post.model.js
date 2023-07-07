const { Schema, model } = require('mongoose');

const PostSchema = new Schema(
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
		body: {
			type: String,
			required: [true, 'Please enter a body'],
		},
	},
	{ versionKey: false, timestamps: true }
);

module.exports = model('Post', PostSchema);

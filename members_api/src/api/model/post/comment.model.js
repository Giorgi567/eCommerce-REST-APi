const { Schema, model } = require('mongoose');

const CommentSchema = new Schema(
	{
		post: {
			type: Schema.Types.ObjectId,
			ref: 'Post',
			required: true,
		},
		title: {
			type: String,
			required: [true, 'Please enter a title'],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

module.exports = model('Comment', CommentSchema);

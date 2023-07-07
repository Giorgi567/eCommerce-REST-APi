const { Schema, model } = require('mongoose');

const TodoSchema = new Schema(
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
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

module.exports = model('Todo', TodoSchema);

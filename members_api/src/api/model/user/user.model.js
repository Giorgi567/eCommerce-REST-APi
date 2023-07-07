const { Schema, model } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');
const { randomBytes, createHash } = require('crypto');
const { sign } = require('jsonwebtoken');

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter a name'],
		},
		username: {
			type: String,
			required: [true, 'Please enter a username'],
			unique: true,
		},
		email: {
			type: String,
			required: [true, 'Please enter a email'],
			unique: true,
			match: [
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				'Please enter a valid email address',
			],
		},
		photo: String,
		role: {
			type: String,
			enum: ['USER', 'ADMIN'],
			default: 'USER',
		},
		password: {
			type: String,
			required: [true, 'Please enter a password'],
		},
		resetPasswordToken: String,
		resetPasswordTokenExpire: Date,
		phone: {
			type: String,
			required: [true, 'Please enter a phone'],
		},
		website: {
			type: String,
			required: [true, 'Please enter a website'],
		},
	},
	{ versionKey: false, timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const generated_salt = await genSalt(10);

	this.password = await hash(this.password, generated_salt);
});

UserSchema.methods.matchPassword = async function (entered_password) {
	return await compare(entered_password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
	const reset_token_key = randomBytes(20).toString('hex');

	this.resetPasswordToken = createHash('sha256').update(reset_token_key).digest('hex');
	this.resetPasswordTokenExpire = Date.now() + 900000;

	return reset_token_key;
};

UserSchema.methods.getJwt = function () {
	return sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: 900000 });
};

module.exports = model('User', UserSchema);

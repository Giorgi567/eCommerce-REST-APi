const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const google = require('googleapis').google;

dotenv.config({ path: `${__dirname}/../config/environment/${process.env.NODE_ENV}.env` });

const oAuth2Client = new google.auth.OAuth2(
	process.env.GMAIL_SERVICE_CLIENT_ID,
	process.env.GMAIL_SERVICE_CLIENT_SECRET,
	process.env.GMAIL_SERVICE_REDIRECT_URL
);

oAuth2Client.setCredentials({
	refresh_token: process.env.GMAIL_SERVICE_REFRESH_TOKEN,
});

const sendEmail = async (options) => {
	const accessToken = await oAuth2Client.getAccessToken();

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.GMAIL_EMAIL,
			clientId: process.env.GMAIL_SERVICE_CLIENT_ID,
			clientSecret: process.env.GMAIL_SERVICE_CLIENT_SECRET,
			refreshToken: process.env.GMAIL_SERVICE_REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});

	let message_options = {
		from: `${process.env.APP_NAME} <${process.env.GMAIL_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	let message_status = false;

	await transporter.sendMail(message_options, function (error, info) {
		if (error) {
			console.error(
				`An email could not be sent to the customer whose email address is: ${options.email} -----> ${error}`
			);

			message_status = true;
		}
	});

	return message_status;
};

module.exports = { sendEmail };

const Responses = require('../common/API_Responses');
require('dotenv').config();
const AWS = require('aws-sdk');

const SES = new AWS.SES();
exports.handler = async (event) => {
	try {
		const { to = '', from = '', subject = '', text = '' } = JSON.parse(event.body);

		if (!to || !from || !subject || !text) {
			return Responses._400({ message: 'to || !from || subject || text missing' });
		}

		const emailSettings = {
			Destination: {
				ToAddresses: [to],
			},
			Message: {
				//   could be HTML
				Body: {
					Text: { Data: text },
				},
				Subject: { Data: subject },
			},
			Source: from,
		};

		const email = await SES.sendEmail(emailSettings).promise();
		return Responses._200({ email });
	} catch (err) {
		console.log(err);
		return Responses._400({ message: `message:${error.message} stack: ${error.stack}` });
	}
};

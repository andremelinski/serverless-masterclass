const Responses = require('../../common/API_Responses');
require('dotenv').config();
const AWS = require('aws-sdk');

const SES = new AWS.SES();
exports.handler = async () => {
	try {
		const to = 'andremelinski29@gmail.com',
			from = 'andremelinski29@gmail.com',
			subject = 'Some reminder';
		const text = `
               <html>
                    <body>
                         <h2>This is a test using HTML</h2>
                    </body>
               </html>
          `;

		if (!to || !from || !subject || !text) {
			return Responses._400({ message: 'to || !from || subject || text missing' });
		}

		const emailSettings = {
			Destination: {
				ToAddress: [to],
			},
			Message: {
				Body: {
					Html: { Data: text },
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

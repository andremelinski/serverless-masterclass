import { APIGatewayProxyResult, SQSEvent, SQSMessageAttributes } from "aws-lambda";
import { Responses } from "./API_Responses";
import { SES } from 'aws-sdk';
const ses = new SES();
export const handler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
	try {
        console.log({event})
    for (const record of event.Records) {
      const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      console.log('Message Attributtes -->  ', messageAttributes.to.stringValue);
      console.log('Message Body -->  ', record.body);
		const emailSettings = {
			Destination: {
				ToAddresses: [messageAttributes.to.stringValue!],
			},
			Message: {
				//   could be HTML
				Body: {
					Html: { Data: record.body },
				},
				Subject: { Data: messageAttributes.subject.stringValue! },
			},
			Source: messageAttributes.from.stringValue!,
		};

            await ses.sendEmail(emailSettings).promise();

            // await sqs
			// 	.deleteMessage({
			// 		QueueUrl: process.env.QUEUE_URL,
			// 		ReceiptHandle: record.receiptHandle,
			// 	})
			// 	.promise();
		}
		return Responses._200({ message: "done" });
	} catch (err) {
		console.log(err);
		return Responses._400({ message: `message:${err.message} stack: ${err.stack}` });
	}
};

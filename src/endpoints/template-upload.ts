import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const parser = require('lambda-multipart-parser');
import { SQS } from 'aws-sdk';
import { Responses } from '../common/API_Responses';
const sqs = new SQS({ region: 'us-east-1' });

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME!;
//  TODO: tem que ser html
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		if (!event || !event.body?.length) {
			return Responses._400({ message: 'incorrect body on request' });
		}
        console.log({body: event.body || "body vazio"});

		const parsedBody = await parser.parse(event);

		if (!parsedBody?.files) {
			return Responses._400({ message: 'missing file body' });
		}

		const fileInfo = parsedBody.files[0];
		const filePath = `templates/${fileInfo.fileName}`;

		await sqs
			.sendMessage({
				QueueUrl: `https://sqs.us-east-1.amazonaws.com/467159351154/queueTest`,
				MessageBody: Buffer.from(fileInfo.content, 'base64').toString(),
				MessageAttributes: {
					bucketName: {
						StringValue: BUCKET_NAME,
						DataType: 'String',
					},
					filePath: {
						StringValue: filePath,
						DataType: 'String',
					},
					contentType: {
						StringValue: fileInfo.contentType,
						DataType: 'String',
					},
				},
			})
			.promise();

		return Responses._200('ok');
	} catch (error) {
		console.log('error', error);
		return Responses._500({ message: error.message });
	}
};

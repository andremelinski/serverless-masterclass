import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const parser = require('lambda-multipart-parser');
import { S3 } from 'aws-sdk';
import { Responses } from '../common/API_Responses';
import { v4 } from 'uuid';
const s3 = new S3({ region: 'us-east-1' });

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME!;
//  TODO: tem que ser html
const allowedMimes = ['text/html'];
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

		if (!allowedMimes.includes(fileInfo.contentType)) {
			return Responses._400({ message: 'mime is not allowed ' });
		}

		const filePath = `templates/${v4()}`;

		const params = {
			Bucket: BUCKET_NAME,
			Key: filePath,
			Body: fileInfo.content,
			ContentType: fileInfo.contentType,
			ACL: 'public-read',
		};

		const uploadResult = await s3.upload(params).promise();
		const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${filePath}`;
		return Responses._200({ uploadResult, url });
	} catch (error) {
		console.log('error', error);
		return Responses._500({ message: error.message });
	}
};

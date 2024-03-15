import { SQSEvent, SQSMessageAttributes } from "aws-lambda";
import { S3 } from "aws-sdk";
const s3 = new S3({ region: 'us-east-1' });

export const handler = async (event: SQSEvent): Promise<void> => {
	try {
    	for (const record of event.Records) {
			const messageAttributes: SQSMessageAttributes = record.messageAttributes;
			const filePath = `${messageAttributes.filePath.stringValue}/${messageAttributes.fileName.stringValue}`;
			console.log('Message filePath -->  ', filePath);
			console.log('Message contentType -->  ', messageAttributes.contentType.stringValue);
			const params = {
				Bucket: messageAttributes.bucketName.stringValue!,
				Key: filePath,
				Body: Buffer.from(record.body, 'base64'),
				ContentType: messageAttributes.contentType.stringValue,
				ACL: 'public-read',
			};
			console.log(params);

			await s3.upload(params).promise();

			const url = `https://${messageAttributes.bucketName.stringValue}.s3.amazonaws.com/${filePath}`;
			console.log(url);
		}
	} catch (err) {
		console.log(err);
	}
};

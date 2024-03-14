import { SQSEvent, SQSMessageAttributes } from "aws-lambda";
import { S3 } from "aws-sdk";
const s3 = new S3({ region: 'us-east-1' });

export const handler = async (event: SQSEvent): Promise<void> => {
	try {
    	for (const record of event.Records) {
			const messageAttributes: SQSMessageAttributes = record.messageAttributes;
			console.log('Message Attributtes -->  ', messageAttributes.to.stringValue);
			console.log('Message Body -->  ', record.body);
			const filePath = `${messageAttributes.filePath.stringValue}/${messageAttributes.fileName.stringValue}`;

			const params = {
				Bucket: messageAttributes.bucketName.stringValue!,
				Key: filePath,
				Body: record.body,
				ContentType: messageAttributes.ContentType.stringValue,
				ACL: 'public-read',
			};
			await s3.upload(params).promise();

			const url = `https://${messageAttributes.bucketName.stringValue}.s3.amazonaws.com/${filePath}`;
			console.log(url)
		}
	} catch (err) {
		console.log(err);
	}
};

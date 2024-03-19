import { S3, SQS } from 'aws-sdk';
import { Responses } from '../common/API_Responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUUID } from '../common/get-uuid';
import { v4 } from 'uuid';
import handlebars from 'handlebars';
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const sqs = new SQS();
const s3 = new S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME!;
const QUEUE_NAME = process.env.QUEUE_NAME!;
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		// retrieves uuid from request path
		const uuid = getUUID(event);

		// getting the object with aws-sdk, ".promise()" is required to use async-await
		const output = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				// Key is file name in AWS terminology
				Key: `templates/${uuid}`,
			})
			.promise();
			const payload = output.Body!.toString();
			console.log(payload);
			const buffer = Buffer.from(payload, 'utf-8').toString()
			
		// const response = await pdf.create(document, options).then();
		const data = {
			nome: ' Pdf generation using puppeteer',
			cargaHoraria: ' Handlebar is awesome!',
		};
		const template = handlebars.compile(buffer);
		const html = template(data);

		const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true
      });
		const page = await browser.newPage();
		await page.setContent(html, {
			waitUntil: ['domcontentloaded', 'networkidle0', 'load'],
		});
    	await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
		const response = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
		});
		await browser.close();
		const filePath = `templates/${v4()}`;

		await sqs
			.sendMessage({
				QueueUrl: `https://sqs.us-east-1.amazonaws.com/467159351154/mailQueue`,
				MessageBody: '<h1>Hello word<h1/>',
				MessageAttributes: {
					to: {
						StringValue: 'andremelinski29@gmail.com',
						DataType: 'String',
					},
					from: {
						StringValue: 'andremelinski29@gmail.com',
						DataType: 'String',
					},
					subject: {
						StringValue: 'subject from sqs',
						DataType: 'String',
					},
				},
			})
			.promise();

		const params = {
			Bucket: BUCKET_NAME,
			Key: filePath,
			Body: response,
			ContentType: 'application/pdf',
			ACL: 'public-read',
		};
		await s3.upload(params).promise();

		const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${filePath}`;
		return {
			statusCode: 200,
			body: url || 'nothing',
		};
	} catch (e) {
		console.log(e)
		// handles error response
		return Responses._500(e);
	}
};

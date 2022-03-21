const Responses = require('../common/API_Responses')
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event) => {

    try{
        const params = {
			Bucket: BUCKET_NAME,
			Key: decodeURIComponent(event.pathParameters.fileKey),
		};
		const data = await s3.getObject(params).promise();
        return Responses._200({ data });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
}
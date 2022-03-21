const Responses = require('../common/API_Responses')
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event) => {
    try {
        const {key = '', prefix = ''} = event.queryStringParameters
        const params = {
            Bucket: BUCKET_NAME,
            Key = `${prefix}/${key}`
        };

		const deleteResult = await s3.deleteObject(params).promise();
        return Responses._200({ message: "file deleted", deleteResult });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
}
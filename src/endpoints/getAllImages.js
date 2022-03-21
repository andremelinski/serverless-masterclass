const Responses = require('../common/API_Responses')
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event) => {

    try{
        const files = await s3.listObjectsV2({Bucket: BUCKET_NAME, Prefix: 'images'}).promise()
        return Responses._200({ files });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
}
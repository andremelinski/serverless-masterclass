const Responses = require('../common/API_Responses')
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async () => {

    try{
        const {Contents = []} = await s3.listObjectsV2({Bucket: BUCKET_NAME, Prefix: 'images'}).promise()
        const urls = Contents.flatMap(el => `https://${BUCKET_NAME}.s3.amazonaws.com/${el.Key}`)
        return Responses._200({ urls });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
}
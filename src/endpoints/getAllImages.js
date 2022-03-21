const Responses = require('../common/API_Responses')
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

exports.handler = async (event) => {

    try{
        const {key = '', prefix = ''} = event.queryStringParameters
        const params = {
            Bucket: BUCKET_NAME
        };

        if(key){
            params.Key = `${prefix}/${key}`
            const presignedUrl = await s3.getSignedUrl('getObject', params).promise();
            const data = await s3.getObject(params).promise();
            return Responses._200({ presignedUrl, data });
        }

        const {Contents = []} = await s3.listObjectsV2(params).promise()
        const urls = Contents.flatMap(el => `https://${BUCKET_NAME}.s3.amazonaws.com/${el.Key}`)
        return Responses._200({ urls });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
}
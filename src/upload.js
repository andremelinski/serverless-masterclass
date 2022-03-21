const Responses = require('./common/API_Responses')
require("dotenv").config()
const {v4 : uuid} = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const REGION = process.env.REGION || "us-east-1";
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
const contentTypeRegex = /data:\s*(\w+\/\w+)/

module.exports.handler = async (event) => {

    try {
        const parsedBody = JSON.parse(event.body);

        if (!body || !parsedBody.file) {
            return Responses._400({ message: 'incorrect body on request' });
        }

        let base64File = parsedBody.file;

        if (!contentTypeRegex.test(base64File)) {
            return Responses._400({ message: 'mime not found' });
        }

        let [contentType] =  contentTypeRegex.exec(base64File)
        contentType = contentType.replace('data:', '')

        if (!allowedMimes.includes(contentType)) {
            return Responses._400({ message: 'mime is not allowed ' });
        }

        base64File = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const filePath = `images/${uuid()}`

        const params = {
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: base64File,
            ContentType: contentType,
            ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();
        const url = `https://${BUCKET_NAME}.s3-${REGION}.amazonaws.com/${filePath}`;
        return Responses._200({ uploadResult, url });
    } catch (error) {
        console.log('error', error);
        return Responses._400({ message: error.message || 'failed to upload image' });
    }
};
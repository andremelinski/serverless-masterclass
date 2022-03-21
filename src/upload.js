require("dotenv").config()
const {v4 : uuid} = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const REGION = process.env.REGION
const contentTypeRegex = /(Content-Type:\s*\w+\/\w+)/

module.exports.handler = async (event) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: event }),
    };

    try {
        const parsedBody = Buffer.from(event.body, 'base64');
        let [contentType] =  contentTypeRegex.exec(event.body)
        contentType = contentType.split(':')[1].trim()
        const filePath = `images/${uuid()}`

        const params = {
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: parsedBody,
            ContentType: contentType,
            ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();
        const url = `https://${BUCKET_NAME}.s3-${REGION}.amazonaws.com/${filePath}`;

        response.body = JSON.stringify({ message: "File uploaded", uploadResult, url, contentType });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};
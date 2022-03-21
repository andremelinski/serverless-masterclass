require("dotenv").config()
const {v4 : uuid} = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const REGION = process.env.REGION
const contentTypeRegex = /data:\s*(\w+\/\w+)/

module.exports.handler = async (event) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: event }),
    };

    try {
        const parsedBody = JSON.parse(event.body);
        let base64File = parsedBody.file;
        const [contentType] =  contentTypeRegex.exec(base64File)
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

        response.body = JSON.stringify({ message: "File uploaded", uploadResult, params, url  });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const contentTypeRegex = /(Content-Type:\s*\w+\/\w+)/
module.exports.handler = async (event) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: event }),
    };

    try {
        const parsedBody = Buffer.from(event.body, 'base64');
        let contentType =  contentTypeRegex.exec(event.body)
        contentType = contentType.split(':')[1].trim()

    //     const params = {
    //         Bucket: BUCKET_NAME,
    //         Key: `images/${new Date().toISOString()}.jpeg`,
    //         Body: decodedFile,
    //         ContentType: "image/jpeg",
    //     };

    //     const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({ message: "Successfully uploaded file to S3", parsedBody, contentType, BUCKET_NAME });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};
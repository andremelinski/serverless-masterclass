const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fileType = require('file-type');
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: event }),
    };

    try {
        const parsedBody = Buffer.from(event.body, 'base64');

    //     const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
    //     const params = {
    //         Bucket: BUCKET_NAME,
    //         Key: `images/${new Date().toISOString()}.jpeg`,
    //         Body: decodedFile,
    //         ContentType: "image/jpeg",
    //     };

    //     const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({ message: "Successfully uploaded file to S3", parsedBody, event: event.body });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};
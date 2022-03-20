const fileType = import('file-type');
const ApiResponses = require('../common/API_Responses');
const uuid = require('uuid').v4();
const AWS = require('aws-sdk');
require('dotenv').config()

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jpeg'];
exports.handler = async event => {
    try {
        
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");

        const fileInfo = await fileType.fromBuffer(buffer);
        const detectedExt = fileInfo.ext;
        const detectedMime = fileInfo.mime;
        // if (detectedMime !== body.mime) {
        //     return ApiResponses._400({ message: 'mime types dont match' });
        // }

        const fileName = `${uuid()}-${new Date().toISOString()}-${decodedFile}-${detectedExt}-${detectedMime}`;

        // const bla = await s3
        //     .putObject({
        //         Body: decodedFile,
        //         Key: `images/${fileName}`,
        //         ContentType: body.mime,
        //         Bucket: BUCKET_NAME,
        //         ACL: 'public-read',
        //     })
        //     .promise();

        // const url = `https://${BUCKET_NAME}.s3-${process.env.region}.amazonaws.com/${key}`;
        return ApiResponses._200({
            imageURL:  fileName,
        });
    } catch (error) {
        console.log('error', error);

        return ApiResponses._404({ message: error.message, event: event });
    }
};
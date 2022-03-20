// const fileType = require('file-type');
const ApiResponses = require('../common/API_Responses');
const uuid = require('uuid').v4();
const AWS = require('aws-sdk');
require('dotenv').config()

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
exports.handler = async event => {
    try {
        
        const body = JSON.parse(event.body);

        if (!body || !body.image || !body.mime) {
            return ApiResponses._400({ message: 'incorrect body on request' });
        }

        if (!allowedMimes.includes(body.mime)) {
            return ApiResponses._400({ message: 'mime is not allowed ' });
        }

        let imageData = body.image;
        if (body.image.substr(0, 7) === 'base64,') {
            imageData = body.image.substr(7, body.image.length);
        }

        const buffer = Buffer.from(imageData, 'base64');
        // const fileInfo = await fileType.fromBuffer(buffer);
        // const detectedExt = fileInfo.ext;
        // const detectedMime = fileInfo.mime;

        // if (detectedMime !== body.mime) {
        //     return ApiResponses._400({ message: 'mime types dont match' });
        // }

        const key = `${uuid()}-${new Date().toISOString()}`;

        console.log(`writing image to bucket called ${key}`);

        const bla = await s3
            .putObject({
                Body: buffer,
                Key: `images/${key}`,
                ContentType: body.mime,
                Bucket: BUCKET_NAME,
                ACL: 'public-read',
            })
            .promise();

        // const url = `https://${BUCKET_NAME}.s3-${process.env.region}.amazonaws.com/${key}`;
        return ApiResponses._200({
            imageURL: bla,
        });
    } catch (error) {
        console.log('error', error);

        return ApiResponses._404({ message: error.message, event: JSON.parse(event.body) });
    }
};
const Responses = require('../common/API_Responses');
const fileType = require("file-type");
const uuid = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
require('dotenv').config()

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
exports.handler = async (event) => {
  try {
    console.log(event);
    const body = JSON.parse(event.body);
    let { image: imageData = "" } = body;

    if (!body || !imageData || !body.mime) return Responses._400({ message: "Incorrect body on request" });
    if (!allowedMimes.includes(body.mime)) return Responses._400({ message: "Incorrect mime type" });

    if (imageData.image.substr(0, 7) === "base64") {
      imageData = imageData.substr(7, imageData.length);
    }

    const buffer = Buffer.from(imageData, "base64");
    const fileInfo = await fileType.fromBuffer(buffer);

    const detectedExt = fileInfo.ext;
    const detectedMime = fileInfo.mime;

    if (detectedMime !== body.mime) return Responses._400({ message: "detectedMime !== body.mime" });

    const fileName = `images/${new Date().toISOString()}-${uuid.v5()}-${detectedExt}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: `images/${fileName}`,
        Body: buffer,
        ContentType: body.mime,
        ACL: 'public-read'
    };

    const s3File = await s3.putObject(params).promise();

    // https://BUCKET_NAME.s3-${region}.amazonaws.com/images/${fileName}

    return Responses._200({ image: s3File });
    
  } catch (error) {
    return Responses._404({ message: JSON.stringify(error, null, 2) });
  }
};

import ApiResponses from '../common/API_Responses.js';
import * as fileType from 'file-type';
import { v4 as uuid } from "uuid";
// import * as AWS from 'aws-sdk';
import AWS from 'aws-sdk';
import dotenv from 'dotenv'
dotenv.config()

const { S3 } = AWS;
const s3 = new S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;
const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
export async function handler(event) {
  try {
    console.log(event);
    const body = JSON.parse(event.body);
    let { image: imageData = "" } = body;

    if (!body || !imageData || !body.mime) return ApiResponses._400({ message: "Incorrect body on request" });
    if (!allowedMimes.includes(body.mime)) return ApiResponses._400({ message: "Incorrect mime type" });

    if (imageData.image.substr(0, 7) === "base64") {
      imageData = imageData.substr(7, imageData.length);
    }

    const buffer = Buffer.from(imageData, "base64");
    const fileInfo = await fileType.fromBuffer(buffer);
    console.log(fileInfo);

    const detectedExt = fileInfo.ext;
    const detectedMime = fileInfo.mime;
    console.log({detectedExt, detectedMime});
    if (detectedMime !== body.mime) return ApiResponses._400({ message: "detectedMime !== body.mime" });

    const fileName = `${new Date().toISOString()}-${uuid()}-${detectedExt}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: `images/${fileName}`,
        Body: buffer,
        ContentType: body.mime,
        ACL: 'public-read'
    };

    const s3File = await s3.putObject(params).promise();
    console.log(s3File)
    // https://BUCKET_NAME.s3-${region}.amazonaws.com/images/${fileName}

    return ApiResponses._200({ image: JSON.stringify(s3File, null, 2) });
    
  } catch (error) {
      console.log(error);
    return ApiResponses._404({ message: JSON.stringify(error, null, 2) });
  }
}

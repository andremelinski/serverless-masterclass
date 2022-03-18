"use strict";
require("dotenv").config()
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const buketName = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = (event) => {
  console.log(event);
  // proxy integration because we're using API Gateway
  const response = {
    isBase64: false,
    statusCode: 200,
    body: JSON.stringify({ message: "successfully uploaded" }),
  };

  try {
    const parseBody = JSON.parse(event.body);
    const base64File = parseBody.file;
    const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/,""), base64)
    
    const params = {
      BucketName: buketName,
      Key: `images/${new Date().toISOString()}.jpeg`,
      Body: decodedFile,
      ContentType: "image/jpeg"
    }

    const uploadResult = await s3.upload(params).promise();

    response.body = { message: "successfully uploaded", uploadResult }
  } catch (error) {
    console.log(error);
    response.body = JSON.stringify({ message: "upload failed"})
    response.statusCode = 500
  }
  return response
};

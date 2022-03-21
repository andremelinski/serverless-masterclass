const Responses = require('../common/API_Responses')
require("dotenv").config()
const {v4 : uuid} = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const REGION = process.env.REGION || "us-east-1";
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
const contentTypeRegex = /data:\s*(\w+\/\w+)/
exports.handler = async (event) => {}
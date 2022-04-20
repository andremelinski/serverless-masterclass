# Serverless Creating User with API Gateway, AWS Lambda & DynamoDB

## Problem

Build a serverless architeture to upload media files from different users into your application

## Services

- [API Gateway](https://docs.aws.amazon.com/api-gateway/): APIs act as the "front door" for front-end applications, and secure APIs at any scale.
- [Lambda function](https://aws.amazon.com/lambda/): Serverless function that can run code without provisioning or managing infrastructure.
- [DynamoDB](https://aws.amazon.com/s3/): Serverless NoSQL Database to save information from the user and their scores

## Project

- Receives username and Score from user;
- API Gateway validates the parameters
- Once fields are validated, lambda function will save in DynamoDB

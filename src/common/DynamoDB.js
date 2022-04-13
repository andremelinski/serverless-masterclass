const AWS = require('aws-sdk');
const {dynamoError} = require('../common/helper/errorHandling')
const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) dynamoError('fetching', TableName, ID);
        return data.Item;
    },

    async write(data, TableName) {
        if (!data.ID) {
            dynamoError('noId', ID, TableName);
        }

        const params = {
            TableName,
            Item: data,
        };
        const res = await documentClient.put(params).promise();

        if (!res) dynamoError('inserting', TableName, ID);
        console.log(res)
        return data;
    },
};
module.exports = Dynamo;
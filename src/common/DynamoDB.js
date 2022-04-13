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

        if (!data || !data.Item) return
        
        return data.Item;
    },

    async write(data, TableName) {
        
        if (!data.ID) throw Error(await dynamoError('noId', TableName));

        const params = {
            TableName,
            Item: data,
        };
        const res = await documentClient.put(params).promise();

        if (!res) throw Error(await dynamoError('inserting', TableName, ID));
        
        return data;
    },
};
module.exports = Dynamo;
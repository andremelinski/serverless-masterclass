const AWS = require('aws-sdk');
const {dynamoError} = require('../common/helper/errorHandling')
const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(ID, TableName) {
        try{
        const params = {
            TableName,
            Key: {
                ID,
            },
        };
        console.log(params);
        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) dynamoError('fetching', TableName, ID);
        console.log(data)
        return data.Item;
    }catch(e){
        console.log(e)
        return 
    }
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
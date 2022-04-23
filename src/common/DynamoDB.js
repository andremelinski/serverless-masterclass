const AWS = require('aws-sdk');
const { dynamoError } = require('../common/helper/errorHandling');
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

		if (!data || !data.Item) throw new Error(await dynamoError('fetching', TableName, ID));
		return data.Item;
	},

	async write(data, TableName) {
		if (!data.ID) throw new Error(await dynamoError('noId', TableName));

		const params = {
			TableName,
			Item: data,
		};
		const res = await documentClient.put(params).promise();

		if (!res) throw new Error(await dynamoError('inserting', TableName, data));

		return data;
	},

	async delete(ID, TableName) {
		const params = {
			TableName,
			Key: {
				ID,
			},
		};
		const deleteData = await documentClient.delete(params).promise();
		if (!deleteData) throw new Error(await dynamoError('deleting', TableName, data));
		return deleteData;
	},
};
module.exports = Dynamo;

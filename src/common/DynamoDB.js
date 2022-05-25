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

	update: async ({ tableName, primaryKey, primaryKeyValue, updateKey, updateValue }) => {
		const params = {
			TableName: tableName,
			Key: { [primaryKey]: primaryKeyValue },
			UpdateExpression: `set ${updateKey} = :updateValue`,
			ExpressionAttributeValues: {
				':updateValue': updateValue,
			},
		};
		return await documentClient.put(params).promise();
	},
};
module.exports = Dynamo;

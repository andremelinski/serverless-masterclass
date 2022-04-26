require('dotenv').config();
const Response = require('../common/API_Responses');
const Dynamo = require('../common/DynamoDB');

const tableName = process.env.TABLE_NAME;
exports.handler = async (event) => {
	try {
		const { connectionId: ID, domainName, stage } = event.requestContext;
		const data = {
			ID,
			date: Date.now(),
			messages: [],
			domainName,
			stage,
		};

		await Dynamo.write(data, tableName);
		return Response._200({ message: 'connected' });
	} catch (err) {
		console.log(err);
		return Response._400({ message: err });
	}
};

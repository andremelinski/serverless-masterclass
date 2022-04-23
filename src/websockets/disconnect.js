require('dotenv').config();
const Response = require('../common/API_Responses');
const Dynamo = require('../common/DynamoDB');

const tableName = process.env.TABLE_NAME;
exports.handler = async (event) => {
	try {
		const { connectionId } = event.requestContext;
		await Dynamo.delete(connectionId, tableName);
		return Response._200({ message: 'disconnected' });
	} catch (err) {
		return Response._400({ message: err });
	}
};

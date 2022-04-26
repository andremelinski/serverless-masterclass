require('dotenv').config();
const Response = require('../common/API_Responses');
const Dynamo = require('../common/DynamoDB');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.TABLE_NAME;
exports.handler = async (event) => {
	try {
		const { connectionId } = event.requestContext;
		const { message } = JSON.parse(event.body);

		const record = await Dynamo.get(connectionId, tableName);
		let { messages, domainName, stage } = record;
		messages = [...messages, message];

		const data = {
			...record,
			messages,
		};

		await Dynamo.write(data, tableName);

		await WebSocket.send({ domainName, connectionId, stage, message });
		return Response._200({ message: 'got a message' });
	} catch (err) {
		return Response._400({ message: err });
	}
};

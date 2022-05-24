require('dotenv').config();
const Responses = require('../../common/API_Responses');
const Dynamo = require('../../common/DynamoDB');
const { dynamoError } = require('../../common/helper/errorHandling');

const USER_TABLE_NAME = process.env.USER_TABLE_NAME;
exports.handler = async (event) => {
	const userId = event.pathParameters.id;
	const { score } = event.body;

	if (!userId) {
		const message = await dynamoError('noId', USER_TABLE_NAME);
		return Responses._400({ message });
	}

	if (!score) {
		const message = await dynamoError('fetching', USER_TABLE_NAME, userId);
		return Responses._400({ message });
	}

	const message = await Dynamo.update({
		tableName,
		primaryKey: 'id',
		updateKey: 'score',
		updateValue: score,
	});

	return Responses._200({ message });
};

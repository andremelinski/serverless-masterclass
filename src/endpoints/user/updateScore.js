require('dotenv').config();
const Responses = require('../../common/API_Responses');
const Dynamo = require('../../common/DynamoDB');
const { dynamoError } = require('../../common/helper/errorHandling');

const USER_TABLE_NAME = process.env.USER_TABLE_NAME;
exports.handler = async (event) => {
	try {
		const { ID = '' } = event.pathParameters;
		const { score } = event.body;
		if (!ID) {
			const message = await dynamoError('noId', USER_TABLE_NAME);
			return Responses._400({ message });
		}

		console.log({ score });
		if (!score) {
			const message = await dynamoError('fetching', USER_TABLE_NAME, ID);
			return Responses._400({ message });
		}

		const message = await Dynamo.update({
			tableName,
			primaryKey: 'ID',
			primaryKeyValue: ID,
			updateKey: 'Score',
			updateValue: score,
		});

		return Responses._200({ message });
	} catch (err) {
		console.log(err);
		return Responses._400({ err: err.message || err.stack });
	}
};

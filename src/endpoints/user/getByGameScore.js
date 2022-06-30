require('dotenv').config();
const Responses = require('../../common/API_Responses');
const Dynamo = require('../../common/DynamoDB');
exports.handler = async (event) => {
	const { game = '' } = event.pathParameters;
	if (!game) return Responses._400({ message: `missing the game from the path` });

	const gamePlayers = await Dynamo.query({
		tableName: process.env.USER_TABLE_NAME,
		index: 'game-index',
		queryKey: 'game',
		queryValue: game,
	});

	return Responses._200(gamePlayers);
};

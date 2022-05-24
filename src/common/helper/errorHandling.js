module.exports.dynamoError = async (actionType, TableName, id) => {
	const errosType = {
		fetching: `There was an error fetching the data for ID of ${id} from ${TableName}`,
		inserting: `There was an error inserting the data from ${id} from ${TableName}`,
		noId: `Id not provided on the data for table ${TableName}`,
		update: `Attribute to update in ${id} not found ${TableName}`,
	};
	return errosType[actionType];
};

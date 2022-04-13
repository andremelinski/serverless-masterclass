module.exports.dynamoError =  (actionType, TableName, id) => {
    console.log("aqui")
    const errosType = {
        fetching: (`There was an error fetching the data for ID of ${id} from ${TableName}`),
        inserting: (`There was an error inserting the data for ID of ${id} from ${TableName}`),
        noId: (`Id not provided on the data for table ${TableName}`),
    }
    throw Error(errosType[actionType])
}
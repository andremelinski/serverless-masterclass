require("dotenv").config()
const Responses = require('../../common/API_Responses')
const Dynamo = require('../../common/DynamoDB')

const userTableName = process.env.USER_TABLE_NAME
exports.handler = async (event) => {

    if(event.pathParameters || event.pathParameters.ID) return Responses._400({message: "Missing ID from the path"})

    let {ID} = event.pathParameters;

    const user = await Dynamo.get(ID, userTableName).catch(err => {
        console.log("error in Dynamo Get",err)
        return null
    });

    if(!user) return Responses._400({message: "Failed to get user by ID"})

    return Responses._200({user})
}
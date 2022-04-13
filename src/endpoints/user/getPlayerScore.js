require("dotenv").config()
const Responses = require('../../common/API_Responses')
const Dynamo = require('../../common/DynamoDB')

const USER_TABLE_NAME = process.env.USER_TABLE_NAME
exports.handler = async (event) => {

    if(event.pathParameters || event.pathParameters.ID) return Responses._400({message: "Missing ID from the path"})

    let {ID} = event.pathParameters;
    console.log(`Table name ${USER_TABLE_NAME}, ID ${ID}`)
    const user = await Dynamo.get(ID, USER_TABLE_NAME).catch(err => {
        console.log("error in Dynamo Get",err)
        return null
    });

    if(!user) return Responses._400({message: "Failed to get user by ID"})

    return Responses._200({user})
}
require("dotenv").config()
const Responses = require('../../common/API_Responses')
const Dynamo = require('../../common/DynamoDB')

const USER_TABLE_NAME = process.env.USER_TABLE_NAME
exports.handler = async (event) => {
    
    let {ID = ''} = event.pathParameters;
    if(!event.pathParameters || !ID) return Responses._400({message: event.pathParameters, "aqui": 1, table: USER_TABLE_NAME})


    const user = await Dynamo.get(ID, USER_TABLE_NAME).catch(err => {
        console.log("error in Dynamo Get",err)
        return null
    });

    if(!user) return Responses._400({message: {ID, table: USER_TABLE_NAME}})

    return Responses._200({user})
}
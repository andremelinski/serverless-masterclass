require("dotenv").config();
const Responses = require("../../common/API_Responses");
const Dynamo = require("../../common/DynamoDB");
const { dynamoError } = require("../../common/helper/errorHandling");

const USER_TABLE_NAME = process.env.USER_TABLE_NAME;
exports.handler = async (event) => {
  try {
    let message = "";
    let { ID = "" } = event.pathParameters;

    if (!event.pathParameters || !ID) {
      message = await dynamoError("noId", TableName);
      return Responses._400({ message });
    }

    const user = await Dynamo.get(ID, USER_TABLE_NAME).catch((err) => {
      console.log("error in Dynamo Get", err);
      return null;
    });

    if (!user) {
      message = await dynamoError("fetching", TableName, ID);
      return Responses._400({ message });
    }

    return Responses._200({ user });
  } catch (err) {
    return Responses._400({ err });
  }
};

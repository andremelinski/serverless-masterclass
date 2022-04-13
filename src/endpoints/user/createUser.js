require("dotenv").config();
const Responses = require("../../common/API_Responses");
const Dynamo = require("../../common/DynamoDB");
const { dynamoError } = require("../../common/helper/errorHandling");
const { v4: uuidv4 } = require("uuid");

const USER_TABLE_NAME = process.env.USER_TABLE_NAME;
exports.handler = async (event) => {
  try {
    const userInfo = JSON.parse(event.body);
    userInfo.ID = uuidv4();
    const newUser = await Dynamo.write(userInfo, USER_TABLE_NAME).catch((err) => {
      console.log(err);
      return;
    });

    if (!newUser) {
      const message = await dynamoError("fetching", USER_TABLE_NAME, userInfo.ID);
      return Responses._400({ message });
    }

    return Responses._200({ newUser });
  } catch (err) {
    return Responses._400({ err: err.message || err.stack });
  }
};

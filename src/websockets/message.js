require("dotenv").config();
const Response = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB");

const tableName = process.env.TABLE_NAME;
exports.handler = async (event) => {
  try {
    const { connectionId } = event.requestContext;
    const { message } = JSON.parse(event.body);

    const record = await Dynamo.get(connectionId, tableName);
    let { messages } = record;
    messages = [...messages, message];

    const data = {
      ...record,
      messages,
    };

    await Dynamo.write(data, tableName);
    return Response._200({ message: "got a message" });
  } catch (err) {
    console.log(err);
    return Response._400({ message: err });
  }
};

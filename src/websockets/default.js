require('dotenv').config();
const Response = require('../common/API_Responses');
exports.handler = async (event) => {
	return Response._200({ message: { path: 'default', event } });
};

const AWS = require('aws-sdk');

const create = (domainName, stage) => {
	const endpoint = `${domainName}/${stage}`;
	const apiGatewayManager = new AWS.ApiGatewayManagementApi({
		apiVersion: '2018-11-29',
		endpoint,
	});
	return apiGatewayManager;
};

const send = ({ domainName, stage, connectionId, message }) => {
	const websocket = create(domainName, stage);
	const postParams = { connectionId, Data: message };
	return websocket.postToConnection(postParams).promise();
};

module.exports = { send };

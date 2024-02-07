import { APIGatewayProxyEvent } from "aws-lambda";

export const getUUID = (event: APIGatewayProxyEvent): string => {
	const uuid = event.pathParameters!['uuid'];

	// if uuid is non-existent throws HTTP error - bad request
	if (!uuid) {
		throw "uuid not sent"
	}

	return uuid;
};

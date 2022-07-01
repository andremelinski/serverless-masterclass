import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';

import schema from '../../global/schema/city.schema';
import { CitiesRepository } from 'src/global/repositories/city.repository';
import { Responses } from 'src/global/apiGatewayResponses';
const cityRepository = new CitiesRepository();
const response = new Responses();
export const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	try {
		const city = event.pathParameters?.city;
		if (!city) {
			return response._400({ message: 'Invalid city' });
		}
		const cityInformation = await cityRepository.getCityInformation(city);
		if (!cityInformation) {
			return response._404({ message: 'City not found' });
		}
		return response._200(cityInformation);
	} catch (error) {
		console.log(error);
		return response._400(error);
	}
};

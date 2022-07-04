import { CityRepository } from '../schema/city.repository';
import cities from './cities.mock.json';
import { ICitiesRepository } from './city.interface';

export class CitiesRepository implements ICitiesRepository {
	async getCityInformation(cityName: string): Promise<CityRepository> {
		const vla = cities.find((city) => city.name === cityName);
		return vla;
	}
}

import { CityRepository } from 'src/global/schema/city.repository';

interface ICitiesRepository {
	getCityInformation(cityName: string): Promise<CityRepository>;
}

export { ICitiesRepository };

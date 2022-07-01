import schema from '../../global/schema/city.schema';

export default {
	handler: `handler.getCityInfo`,
	events: [
		{
			http: {
				method: 'get',
				cors: true,
				path: 'get-city/{city}',
				request: {
					schemas: {
						'application/json': schema,
					},
				},
			},
		},
	],
};

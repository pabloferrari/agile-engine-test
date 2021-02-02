import { IAppRoutes } from '../config/app.interface';

import { AppRoutes } from './app.routes';

export const AppRouter: IAppRoutes[] = [
	{
		name: 'api',
		routes: [
			new AppRoutes('/api')
		],
	}
];

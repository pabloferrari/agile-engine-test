import { IAppConfig } from './app.interface';
import { HOST, PORT, APP_ENV } from './enviroments';

export const AppConfig: IAppConfig = {
	host: HOST,
    port: PORT,
    env: APP_ENV
};

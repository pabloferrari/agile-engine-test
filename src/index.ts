import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import { AppConfig } from './config/app.config';
import { AppRouter } from './routes/router';
import { AppMiddleWares } from './middlewares/app.middleware';
// import { logger } from './lib/logger';

class Index {
	app: App;

	constructor() {
		this.app = new App({
            app: express(),
            port: AppConfig.port,
            routes: AppRouter,
            middleWares: AppMiddleWares
		});
		this.main();
	}

	/**
	 * initial function
	 *
	 * @protected
	 * @memberof Index
	 */
	protected main(): void {
		this.app.listen();
	}
}

new Index();
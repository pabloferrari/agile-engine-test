import express, { Response, Request } from 'express';
import { Application } from 'express';

import { IAppInit, IAppRoutes } from './config/app.interface';
import { AppConfig } from './config/app.config';
import { logger } from './lib/logger';
import database from './config/database';

import { AgileEngineService } from './services/AgileEngineService';

export default class App {
	private app: Application;
	private port: number;
	public connection!: any;

	constructor(appInit: IAppInit) {
		this.app = appInit.app;
		this.port = appInit.port;
	
		this.startDatabase();
		this.middlewares(appInit.middleWares);
		this.routes(appInit.routes);
    }
    
    private async startDatabase(): Promise<void> {
        this.connection = database; // Store the connection object in the class instance.
        
        logger.debug(`Application ${AppConfig.env} is run on port ${this.port}`);
        
        const agileEngineService = new AgileEngineService();
        
        await agileEngineService.getImages();
        await agileEngineService.setImageDetails();
        await agileEngineService.sendImagesToCache();
	}
	
	/**
     * MIDDLEWARES
     *
     * @private
     * @param {{ forEach: (arg0: (middleWare: any) => void) => void }} middleWares
     * @memberof App
     */
    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }): void {
		middleWares.forEach(middleWare => {
			this.app.use(middleWare);
		});
	}

	
	/**
     * ROUTES
     *
     * @private
     * @param {IAppRoutes[]} appRoutes
     * @return {*}  {Promise<void>}
     * @memberof App
     */
    private async routes(appRoutes: IAppRoutes[]): Promise<void> {
        appRoutes.forEach(routes => {
            routes.routes.forEach(route => {
                this.app.use(`/`, route.router);
            });
        });

		this.app.all('*', (req: Request, res: Response) => {
			res.status(404).json({ message: 'Route not Found' });
		});
	}

    
    /**
     * START APP
     *
     * @memberof App
     */
    public listen(): void {
		this.app.listen(this.port, () => {
			console.log(`App listening on port: ${this.port}`);
		});
	}
}

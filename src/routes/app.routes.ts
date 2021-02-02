import { response } from 'express';
import { request } from 'http';
import { nextTick } from 'process';
import { Routes } from '../config/router.config';
import { AppController } from '../controllers/AppController';
import { cacheMiddleware } from '../middlewares/cache.middleware';

export class AppRoutes extends Routes {
	constructor(_path: string) {
		super(_path);
	}

	/**
	 * function for loading routes
	 *
	 * @memberof AppRoutes
	 */
	public routes(): void {
		this.router.get(`${this.path}/`, cacheMiddleware, AppController.index);
		this.router.get(`${this.path}/images`, cacheMiddleware, AppController.getImages);
		this.router.get(`${this.path}/images/:id`, cacheMiddleware, AppController.getImageById);
		this.router.get(`${this.path}/search/:searchTerm`, cacheMiddleware, AppController.searchImages);
    }
}
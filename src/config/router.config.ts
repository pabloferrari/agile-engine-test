import express from 'express';

export abstract class Routes {
	router: express.Router;
	path!: string;

	constructor(_path: string) {
		this.router = express.Router();
		this.path = _path;
		this.routes();
	}

	/**
	 * function for loading routes
	 *
	 * @abstract
	 * @memberof Routes
	 */
	abstract routes(): void;
}

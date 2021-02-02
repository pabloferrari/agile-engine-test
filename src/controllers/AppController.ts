import { Request, Response } from 'express';
import { AgileEngineService } from '../services/AgileEngineService';
import cacheService from '../lib/cache';

export class AppController {
	
	public static async index(req: Request, res: Response): Promise<void> {
		try {
			res.status(200).json({ route: 'home' });
		} catch (error) {
			res.status(500).json(error);
		}
	}

	public static async getImages(req: Request, res: Response): Promise<void> {
		try {
			const images = await AgileEngineService.images();
			res.status(200).json(images);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	public static async getImageById(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const image = await AgileEngineService.imageById(id);
			res.status(200).json(image);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	public static async searchImages(req: Request, res: Response): Promise<void> {
		try {
			const searchTerm = req.params.searchTerm;
			const images = await AgileEngineService.searchImages(searchTerm);
			res.status(200).json(images);
		} catch (error) {
			res.status(500).json(error);
		}
	}
	


}

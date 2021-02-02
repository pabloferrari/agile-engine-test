import { Request, Response, NextFunction } from 'express';

export const requireJsonContent = (req: Request, res: Response, next: NextFunction): void => {
	if (req.headers['content-type'] !== 'application/json' && (req.method == 'POST' || req.method == 'PUT')) {
		res.status(400).json({
			message: 'Server requires application/json'
		});
	} else {
		next();
	}
};

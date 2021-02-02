import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import uniqid from 'uniqid';

export const setUniqueId = (req: Request, res: Response, next: NextFunction): void => {
	const uuidHash = req.headers.hashlogger || uniqid();
	httpContext.set('reqId', uuidHash);
	next();
};

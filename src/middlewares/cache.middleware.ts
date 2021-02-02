import { Request, Response, NextFunction } from 'express';
import memoryCache from 'memory-cache';
import { logger } from '../lib/logger';

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const key = req.originalUrl || req.url
    const cachedBody = memoryCache.get(key)
    logger.debug(`Cache middleware -> ${key} -> ${JSON.stringify(cachedBody)}`);
    if (cachedBody) {
        res.json(cachedBody)
        return
    } else {
        next()
    }
}

import memoryCache from 'memory-cache';
import { CACHE_TIME } from '../config/enviroments';

const saveCache = (key: string, value: any) => {
    memoryCache.del(key);
    memoryCache.put(key, value, CACHE_TIME * 1000);
}

const get = (key: string) => {
    return memoryCache.get(key);
}

const deleteKey = (key: string) => {
    memoryCache.del(key);
}

const clearCache = () => {
    memoryCache.clear();
}


export default {
    get,
    deleteKey,
    saveCache,
    clearCache
}

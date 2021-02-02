// ENVIRONMENTS SERVICE
export const APP_NAME = process.env.APP_NAME || 'agile-engine-app';
export const HOST = process.env.HOST || 'http://localhost';
export const APP_ENV = process.env.APP_ENV || 'local';
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;


export const DB_NAME = process.env.DB_NAME || 'app';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '27017';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASS = process.env.DB_PASS || '';
export const MONGODB_URI = process.env.MONGODB_URI || null;

export const URL_AGILE_ENGINE = process.env.URL_AGILE_ENGINE || 'url';
export const API_KEY_AGILE_ENGINE = process.env.API_KEY_AGILE_ENGINE || 'key';
export const CACHE_TIME = process.env.CACHE_TIME ? parseInt(process.env.CACHE_TIME) : 10;

console.log(`URL_AGILE_ENGINE=${URL_AGILE_ENGINE}`);
console.log(`API_KEY_AGILE_ENGINE=${API_KEY_AGILE_ENGINE}`);
console.log(`CACHE_TIME=${CACHE_TIME}`);

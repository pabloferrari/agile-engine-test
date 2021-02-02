import appRoot from 'app-root-path';
import { createLogger, transports, format } from 'winston';
import httpContext from 'express-http-context';
import { AppConfig } from '../config/app.config';
const { combine, timestamp, label, printf } = format;

class LoggerCustom {
	private LOG_FILE_PATH: string;
	private MAX_FILE_SIZE: number;
	private MAX_FILES: number;

	constructor() {
		this.LOG_FILE_PATH = `${appRoot}/logs`;
		this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
		this.MAX_FILES = 5;
	}

	public tsFormat = (timestamp: Date) => {
		const nz = (s: number) => (s < 10 ? `0${s}` : `${s}`);
		const date = new Date(timestamp);
		return `${date.getFullYear()}-${nz(date.getMonth() + 1)}-${nz(date.getDate())} ${nz(date.getHours())}:${nz(date.getMinutes())}:${nz(date.getSeconds())}`;
	};

	/**
	 * setTransports
	 *
	 * @private
	 * @returns {Array<any>}
	 * @memberof LoggerCustom
	 */
	private setTransports(): Array<any> {
		return [
			new transports.File({
				level: 'info',
				filename: `${this.LOG_FILE_PATH}/info.log`,
				handleExceptions: true,
				maxsize: this.MAX_FILE_SIZE,
				maxFiles: this.MAX_FILES
			}),
			new transports.File({
				level: 'debug',
				filename: `${this.LOG_FILE_PATH}/debug.log`,
				handleExceptions: true,
				maxsize: this.MAX_FILE_SIZE,
				maxFiles: this.MAX_FILES
			}),
			new transports.File({
				level: 'error',
				filename: `${this.LOG_FILE_PATH}/error.log`,
				handleExceptions: true,
				maxsize: this.MAX_FILE_SIZE,
				maxFiles: this.MAX_FILES
			}),
			new transports.File({
				level: 'fatal',
				filename: `${this.LOG_FILE_PATH}/fatal.log`,
				handleExceptions: true,
				maxsize: this.MAX_FILE_SIZE,
				maxFiles: this.MAX_FILES
			}),
			new transports.Console({
				level: 'info',
				handleExceptions: true
			})
		];
	}

	/**
	 * setFormat
	 *
	 * @private
	 * @returns {*}
	 * @memberof LoggerCustom
	 */
	private setFormat(): any {
		return printf(({ level, message, label, timestamp }) => {
			const reqId = httpContext.get('reqId');
			const newlabel = reqId ? reqId : label;
			const msg = typeof message == 'object' ? JSON.stringify(message) : message;
			return `${this.tsFormat(timestamp)} [${newlabel}] ${AppConfig.env}.${level}: ${msg}`;
		});
	}

	/**
	 * createLoger
	 *
	 * @returns {*}
	 * @memberof LoggerCustom
	 */
	public createLoger(): any {
		return createLogger({
			format: combine(label({ label: '-' }), timestamp(), this.setFormat()),
			transports: this.setTransports(),
			exitOnError: false,
			exceptionHandlers: [new transports.File({ filename: `${appRoot}/logs/exceptions.log` })]
		});
	}
}

export const logger = new LoggerCustom().createLoger();

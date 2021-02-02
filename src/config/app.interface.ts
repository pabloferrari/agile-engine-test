
/**
 * interface that validates the initial configuration parameters for the application
 *
 * @export
 * @interface IAppConfig
 */
export interface IAppConfig {
	host: string;
	port: number;
	env: string;
}

/**
 * interface that validates the parameters for the start of application.
 *
 * @export
 * @interface IAppInit
 */
export interface IAppInit {
	app: any;
	port: number;
	routes: IAppRoutes[];
	middleWares: any[];
}

/**
 * interface that validate the parameters for group of routes
 *
 * @export
 * @interface IAppRoutes
 */
export interface IAppRoutes {
	name: string;
	routes: any[];
	prefix?: string;
}
import axios from 'axios';
import cacheService from '../lib/cache';
import { Token, IToken } from '../models/Token';
import { Image, IImage } from '../models/Image';
import { URL_AGILE_ENGINE, API_KEY_AGILE_ENGINE } from '../config/enviroments';
import { logger } from '../lib/logger';

export class AgileEngineService {

    public url: string;

    constructor() {
		this.url = URL_AGILE_ENGINE;
	}


    /**
     * STATIC METHOD -> GET IMAGES FROM DB
     *
     * @static
     * @return {*}  {Promise<IImage[]>}
     * @memberof AgileEngineService
     */
    public static async images(): Promise<IImage[]> {
        return Image.find().select('id cropped_picture -_id')
            .then((images: IImage[]) => {
                logger.debug(`images -> ${images.length}`);
                cacheService.saveCache('/api/images', images);
                cacheService.saveCache('/api/images/', images);
                return images;
            })
            .catch((err: any) => {
                logger.error(`ERROR -> ${JSON.stringify(err)}`);
                return err;
            });
    }

    /**
     * STATIC METHOD -> GET IMAGE FROM DB
     *
     * @static
     * @param {string} id
     * @return {*}  {Promise<IImage>}
     * @memberof AgileEngineService
     */
    public static async imageById(id: string): Promise<IImage> {
        return Image.findOne({ id }).select('-_id')
            .then((image: IImage) => {
                logger.debug(`imageById -> ${id} ${JSON.stringify(image)}`);
                const { author, camera, tags, cropped_picture, full_picture } = image;
                cacheService.saveCache(`/api/images/${id}`, { id, author, camera, tags, cropped_picture, full_picture });
                return image;
            })
            .catch((err: any) => {
                logger.error(`ERROR -> ${JSON.stringify(err)}`);
                return err;
            });
    }

    /**
     * GET IMAGES FUNCTION
     *
     * @param {number} [page=1]
     * @param {boolean} [flag=false]
     * @return {*}  {Promise<any>}
     * @memberof AgileEngineService
     */
    public async getImages(page = 1, flag = false): Promise<any> {
        logger.debug(`Get Image => Page ${page} flag [${flag}]`);
        const token = await this.getToken();
        await axios.get(`${this.url}/images?page=${page}`, { headers: { authorization: 'Bearer ' + token } })
        .then(async results => {
            const { data } = results;
            const nextPage = data.page+1;
            await this.savePictures(data.pictures);
            if(data.hasMore === false) {
                logger.debug(`End Get Image on page ${page}! CountPage ${data.pageCount} hasMore: ${data.hasMore}`);
                await this.sendImagesToCache();
                await this.setImageDetails();
            } else {
                if(nextPage <= data.pageCount) {
                    logger.debug(`Results ok page ${page}! Next Page  => ${nextPage} of ${data.pageCount}`);
                    this.getImages(nextPage);
                }
            }
        })
        .catch(async err => {
            if(err.response && err.response.status && err.response.status == 401 && flag == false) {
                await this.killTokens();
                await this.refreshToken();
                await this.getImages(page, true);
            } else {
                logger.error(`Error ${err}`);
            }
        });
        

    }

    /**
     * GET IMAGE DETAIL FUNCTIONS
     *
     * @return {*}  {Promise<void>}
     * @memberof AgileEngineService
     */
    public async setImageDetails(): Promise<void> {
        
        Image.find({ author: undefined })
        .then(async (images: IImage[]) => {
            logger.debug(`getImageDetails() q ${images.length}!`);
            images.forEach(async(img: IImage) => {
                await this.getImageDetails(img.id);
            })
        })
        .catch((err: any) => {
            logger.debug(`getImageDetails() error!`);
            logger.debug(err);
        })
    }

    public async getImageDetails(id: string, flag = false): Promise<void> {
        
        const token = await this.getToken();
        await axios.get(`${this.url}/images/${id}`, { headers: { authorization: 'Bearer ' + token } })
        .then(async results => {
            const { data } = results;
            await Image.findOneAndUpdate({id}, data);
            cacheService.saveCache(`/api/images/${id}`, data);
        })
        .catch(async err => {
            if(err.response && err.response.status && err.response.status == 401 && flag == false) {
                await this.killTokens();
                await this.refreshToken();
                await this.getImageDetails(id, true);
            } else {
                logger.error(`Error ${err}`);
            }
        });
    }

    /**
     * SAVE IMAGES ON DB
     *
     * @param {IImage[]} pictures
     * @return {*}  {Promise<any>}
     * @memberof AgileEngineService
     */
    public async savePictures(pictures: IImage[]): Promise<any> {
        
        for (let index = 0; index < pictures.length; index++) {
            const pic = pictures[index];
            try {
                Image.create(pic);
            } catch (error) {
                logger.debug(`Error -> ${error}`);
            }
        }
    }


    
    /**
     * GET AUTHORIZATION TOKEN
     *
     * @return {*}  {Promise<string>}
     * @memberof AgileEngineService
     */
    public async getToken(): Promise<string> {
        const token = cacheService.get('token');
        if (token) {
            return token;
        }
        
        const tokenDb = await Token.findOne({ auth: true });
        if (tokenDb) {
            return tokenDb.token;
        }
        
        return await this.refreshToken();
    }


    /**
     * SEND IMAGES TO CACHE
     *
     * @return {*}  {Promise<void>}
     * @memberof AgileEngineService
     */
    public async sendImagesToCache(): Promise<void> {
        Image.find()
        .then((images: IImage[]) => {
            const img: any[] = [];
            images.forEach((image: IImage) => {
                const { id, cropped_picture } = image;
                img.push({ id, cropped_picture });
            })
            cacheService.saveCache('/api/images', img);
            cacheService.saveCache('/api/images/', img);
        })
        .catch((err: any) => logger.error(err));
    }

    /**
     * KILL TOKENS
     *
     * @return {*}  {Promise<void>}
     * @memberof AgileEngineService
     */
    public async killTokens(): Promise<void> {
        await Token.find({ auth: true })
        .then((tokens: any) => {
            tokens.forEach((token: { auth: boolean; save: () => void; }) => {
                token.auth = false;
                token.save();
            });
            cacheService.deleteKey('token');
        })
        .catch((err: any) => {
            logger.error(`killTokens => ${JSON.stringify(err)}`);
        })
    }

    /**
     * GET NEW TOKEN
     *
     * @return {*}  {Promise<string>}
     * @memberof AgileEngineService
     */
    public async refreshToken(): Promise<string> {
        return axios.post(`${this.url}/auth`, { apiKey: API_KEY_AGILE_ENGINE })
            .then(async (response) => {
                const { data } = response;
                const newtoken = { auth: data.auth, token: data.token };
                const nToken = await Token.create(newtoken);
                logger.debug(`New Token -> ${JSON.stringify(nToken)}`);
                cacheService.saveCache('token', nToken.token);
                return nToken.token;
            })
            .catch(err => {
                logger.error(err);
                return "";
            });
    }

    
    public static async searchImages(searchTerm: string): Promise<IImage[]> {
        const images = await Image.find( { $or:[ { author: new RegExp(searchTerm, 'i') }, { tags: new RegExp(searchTerm, 'i') }, { camera: new RegExp(searchTerm, 'i') } ]} ).select('id cropped_picture -_id');
        cacheService.saveCache(`/api/search/${searchTerm}`, images);
        return images;
    }



}

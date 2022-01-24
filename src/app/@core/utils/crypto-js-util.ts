import * as CryptoJS from 'crypto-js';
import {environment} from '../../../environments/environment';

export class CryptoJsUtil {

    /**
     * @param data An input to encrypt.
     * */
    public static encrypt(data: any): string {
        return CryptoJS.AES.encrypt(data, environment.LOCAL_STORAGE_KEY).toString();
    }

    /**
     * @param data An encrypted stream of data or object.
     * */
    public static decrypt(data: any): string {
        return CryptoJS.AES.decrypt(data, environment.LOCAL_STORAGE_KEY).toString(CryptoJS.enc.Utf8);
    }

    public static encryptUrl(data: string): string {
        const uuid = this.uuid();
        return CryptoJS.AES.encrypt(data, uuid).toString().replaceAll('/', '!') + '@' + uuid;
    }

    public static uuid(): string {
        // tslint:disable-next-line:no-bitwise
        let firstPart: any = (Math.random() * 46656) | 0;
        // tslint:disable-next-line:no-bitwise
        let secondPart: any = (Math.random() * 46656) | 0;
        firstPart = ('000' + firstPart.toString(36)).slice(-3);
        secondPart = ('000' + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }
}

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
}

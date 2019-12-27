import * as CryptoJS from 'crypto-js';

export class CryptoJsUtil {
  private static KEY = 'SBSOLUTIONS';

  /**
   * @param data An input to encrypt.
   * */
  public static encrypt(data: any): string {
    return CryptoJS.AES.encrypt(data, CryptoJsUtil.KEY).toString();
  }

  /**
   * @param data An encrypted stream of data or object.
   * */
  public static decrypt(data: any): string {
    return CryptoJS.AES.decrypt(data, CryptoJsUtil.KEY).toString(CryptoJS.enc.Utf8);
  }
}

import {ObjectUtil} from './ObjectUtil';

export class NumberUtils {
    /** returns 0 if number is invalid **/
    public static isNumber(value) {
        if (this.isInvalidNumber(value)) {
            return 0;
        } else {
            return Number(value);
        }

    }

    /** returns boolean if number is invalid **/
    public static isInvalidNumber(value) {
        return ObjectUtil.isEmpty(value) || isNaN(value) || !isFinite(value);
    }
}

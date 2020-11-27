import {NumberUtils} from './number-utils';

export class CalculationUtil {
    public static calculateTotalFromList(key: string, list: any[]) {
        let numb;
        numb = list
            .map(l => l[key]).reduce((a, b) => a + b, 0);
        return NumberUtils.isNumber(numb);
    }
}

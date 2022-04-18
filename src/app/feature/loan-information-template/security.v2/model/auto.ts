import {Valuator} from '../../../admin/modal/valuator';
import {BaseEntity} from '../../../../@core/model/base-entity';

export class Auto extends BaseEntity {
    model: string;
    manufactureYear: Date;
    chasisNo: string;
    engineNo: string;
    isNew: boolean;
    valuators: Array<Valuator>;
    quotationAmount: number;
    considerValue: number;
    discountPrice: number;
    data: string;
}

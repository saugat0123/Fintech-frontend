import {BaseEntity} from '../../../@core/model/base-entity';
import {Valuator} from '../../admin/modal/valuator';

export class Auto extends BaseEntity {
    model: string;

    manufactureYear: Date;

    chasisNo: string;

    engineNo: string;

    isNew: boolean;

    vehicalValuator: Valuator;

    quotationAmount: number;

    considerValue: number;

    discountPrice: number;

    data: string;

    freeLimit: number;

    usedAmount: number;

    coverage: number;
}

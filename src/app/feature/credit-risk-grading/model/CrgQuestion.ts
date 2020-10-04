import {Status} from '../../../@core/Status';
import {CrgAnswer} from './CrgAnswer';
import {CustomerType} from "../../customer/model/customerType";

export class CrgQuestion {
    id: number;
    description: string;
    maximumPoints: number;
    appearanceOrder: number;
    weightage: number;
    status: Status;
    version: number;
    crgGroupId: number;
    customerType: CustomerType;
    answers: Array<CrgAnswer>;
}

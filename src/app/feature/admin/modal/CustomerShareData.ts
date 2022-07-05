import {ShareType} from '../../loan/model/ShareType';

export class CustomerShareData {
    id: number;
    version: number;
    companyCode: string;
    companyName: string;
    shareType: ShareType;
    totalShareUnit: number;
    amountPerUnit: number;
    total: number;
    consideredValue: number;
    fmv: number;
    drawingAmount: number;
    realizableAmount: number;
}

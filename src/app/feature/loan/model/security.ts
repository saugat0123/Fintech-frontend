import {Guarantor} from './guarantor';
import {ShareSecurity} from '../../admin/modal/shareSecurity';
import {SecuritiesType} from '../../constants/securities-type';


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    share: ShareSecurity;
    guarantor: Array<Guarantor>;
    fairMarketValue: number;
    distressValue: number;
    considerValue: number;
    securityType: SecuritiesType;
    coverage: number;
    usedAmount: number;
    freeLimit: number;
    templateName: string;
}

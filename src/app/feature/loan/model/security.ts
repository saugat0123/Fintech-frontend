import {Guarantor} from './guarantor';
import {ShareSecurity} from '../../admin/modal/shareSecurity';
import {NepsePriceInfo} from '../../admin/modal/NepsePriceInfo';


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    share: ShareSecurity;
    guarantor: Array<Guarantor>;
    totalSecurityAmount: number;
    nepsePriceInfo: NepsePriceInfo;
}

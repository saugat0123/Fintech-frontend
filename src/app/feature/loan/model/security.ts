import {Guarantor} from './guarantor';
import {ShareSecurity} from '../../admin/modal/shareSecurity';


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    share: ShareSecurity;
    guarantor: Array<Guarantor>;
    totalSecurityAmount: number;
    additionalSecurity: string;
}

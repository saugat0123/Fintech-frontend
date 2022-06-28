import {CustomerShareData} from './CustomerShareData';

export class ShareSecurity {
    id: number;
    data: string;
    version: number;
    customerShareData: Array<CustomerShareData>;
    approvedData: string;
}

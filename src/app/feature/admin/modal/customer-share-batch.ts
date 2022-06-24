import {Status} from '../../../@core/Status';
import {ShareSecurity} from './shareSecurity';

export class CustomerShareBatch {
    id: any;
    status: Status;
    data: any;
    shareSecurity: Array<ShareSecurity>;
}

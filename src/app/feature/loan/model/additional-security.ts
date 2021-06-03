import {ShareSecurity} from '../../admin/modal/shareSecurity';
import {Guarantor} from './guarantor';
import {BaseEntity} from '../../../@core/model/base-entity';

export class AdditionalSecurity extends BaseEntity {
    data: string;
    valuatorId: number;
    share: ShareSecurity;
    guarantor: Array<Guarantor>;
    totalSecurityAmount: number;
    additionalSecurity: string;
}

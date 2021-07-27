import {Status} from '../../../@core/Status';
import {BaseEntity} from '../../../@core/model/base-entity';

export class FiscalYear extends BaseEntity {
    year: string;
    isCurrentYear: boolean;
    status: Status;
    qOneStartDate: Date;
    qOneEndDate: Date;
    qTwoStartDate: Date;
    qTwoEndDate: Date;
    qThreeStartDate: Date;
    qThreeEndDate: Date;
    qFourStartDate: Date;
    qFourEndDate: Date;
    ntaRemarks: string;
}

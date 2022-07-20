import {BaseEntity} from '../../../@core/model/base-entity';

export class ExistingExposure extends BaseEntity {
    loanId: number;
    proposalData: string;
    loanType: string;
    loanName: string;
    loanConfig: any;
    docStatus: any;
    originalLimit: number;
    shareType: any;
    withIn: boolean;
    exposureWithInId: number;
    witInType: number;

}

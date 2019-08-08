import {EntityInfo} from '../../admin/modal/entity-info';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../admin/modal/loan-config';
import {DocStatus} from './docStatus';
import {Priority} from './priority';
import {Customer} from '../../admin/modal/customer';
import {LoanStage} from './loanStage';
import {Proposal} from '../../admin/modal/proposal';
import {Branch} from '../../admin/modal/branch';
import {Cicl} from '../../admin/modal/cicl';
import {Insurance} from '../../admin/modal/insurance';
import {LoanType} from './loanType';

export class LoanDataHolder {
    id: number;
    branch: Branch;
    loanCategory: any;
    customerInfo: Customer;
    entityInfo: EntityInfo;
    dmsLoanFile: DmsLoanFile;
    proposal: Proposal;
    loan: LoanConfig;
    ciclList: Array<Cicl>;
    ciclRemarks: string;
    insurance: Insurance;
    documentStatus: DocStatus;
    priority: Priority;
    createdAt: any;
    previousList: LoanStage[] = [];
    distinctPreviousList: any;
    currentStage: LoanStage = new LoanStage();
    loanType: LoanType;
    createdBy: number;
    parentId: number;
    childId: number;
    isCloseRenew: boolean;
}

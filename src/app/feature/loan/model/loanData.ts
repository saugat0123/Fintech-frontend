import {EntityInfo} from '../../admin/modal/entity-info';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../admin/modal/loan-config';
import {DocStatus} from './docStatus';
import {Priority} from './priority';
import {Customer} from '../../admin/modal/customer';
import {LoanStage} from './loanStage';
import {Proposal} from '../../admin/modal/proposal';
import {Branch} from '../../admin/modal/branch';
import {SiteVisit} from '../../admin/modal/siteVisit';

export class LoanDataHolder {
    id: number;
    branch: Branch;
    customerInfo: Customer;
    entityInfo: EntityInfo;
    dmsLoanFile: DmsLoanFile;
    proposal: Proposal;
    loan: LoanConfig;
    documentStatus: DocStatus;
    siteVisit: SiteVisit;
    priority: Priority;
    createdAt: any;
    previousList: LoanStage[] = [];
    distinctPreviousList: any;
    currentStage: LoanStage = new LoanStage();
    createdBy: number;
}

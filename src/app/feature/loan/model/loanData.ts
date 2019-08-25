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
import {newId} from '@ng-select/ng-select/ng-select/id';
import {SiteVisit} from '../../admin/modal/siteVisit';

export class LoanDataHolder {
    id: number;
    branch: Branch;
    loanCategory: any;
    customerInfo: Customer = new Customer();
    entityInfo: EntityInfo = new EntityInfo();
    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    proposal: Proposal;
    loan: LoanConfig;
    ciclList: Array<Cicl>;
    ciclRemarks: string;
    insurance: Insurance;
    documentStatus: DocStatus;
    siteVisit: Object = new SiteVisit();
    priority: Priority;
    createdAt: any;
    previousList: LoanStage[] = [];
    previousStageList: string;
    distinctPreviousList: any;
    currentStage: LoanStage = new LoanStage();
    loanType: LoanType;
    createdBy: number;
    parentId: number;
    childId: number;
    isCloseRenew: boolean;
}

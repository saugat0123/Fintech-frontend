import {EntityInfo} from '../../admin/modal/entity-info';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../admin/modal/loan-config';
import {DocStatus} from './docStatus';
import {Priority} from './priority';
import {Customer} from '../../admin/modal/customer';
import {LoanStage} from './loanStage';
import {Branch} from '../../admin/modal/branch';

export class LoanDataHolder {
    id: number;
    customerInfo: Customer;
    entityInfo: EntityInfo;
    dmsLoanFile: DmsLoanFile;
    loan: LoanConfig;
    documentStatus: DocStatus;
    priority: Priority;
    createdAt: any;
    previousList: LoanStage[] = [];
    distinctPreviousList: any;
    currentStage: LoanStage = new LoanStage();
    createdBy: number;
    branch: Branch;
}

import {Customer} from '../../admin/modal/customer';
import {EntityInfo} from '../../admin/modal/entity-info';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../admin/modal/loan-config';
import {DocStatus} from './docStatus';

export class LoanDataHolder {
    id: number;
    customerInfo: Customer;
    entityInfo: EntityInfo;
    dmsLoanFile: DmsLoanFile;
    loan: LoanConfig;
    documentStatus: DocStatus;

}

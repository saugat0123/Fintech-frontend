import {CustomerType} from '../../../customer/model/customerType';
import {BaseEntity} from '../../../../@core/model/base-entity';
import {DocStatus} from '../mdocconstant/doc-status';

export class MasterDoc extends BaseEntity {
    docName: string;
    docPath: string;
    mDocData: string;
    customerType: CustomerType;
    status: DocStatus;
    loanData: string;

}

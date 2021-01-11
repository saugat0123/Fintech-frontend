import {LoanCycle} from './loan-cycle';
import {DocumentCheckType} from '../../../@core/model/enum/document-check-type.enum';

export class Document {
    id: number;
    name: string;
    displayName: string;
    url: string;
    loanCycle: Array<LoanCycle>;
    status: string;
    checked: boolean;
    checkType: DocumentCheckType | string;
    containsTemplate: boolean;
    amount: number;
    remarks: string;
    uploadedDate: Date;
}

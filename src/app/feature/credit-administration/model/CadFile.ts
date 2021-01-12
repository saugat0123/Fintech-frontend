import {BaseEntity} from '../../../@core/model/base-entity';
import {Document} from '../../admin/modal/document';

export class CadFile extends BaseEntity {
    customerLoanId: number;
    cadDocument: Document;
    path: string;
    initialInformation: string;
    supportedInformation: string;
    uploadedDate: Date;
    amount: number;
    remarks: string;


}

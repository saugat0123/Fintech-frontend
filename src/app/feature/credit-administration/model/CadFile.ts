import {BaseEntity} from '../../../@core/model/base-entity';

export class CadFile extends BaseEntity {
    customerLoanId: number;
    document: Document;
    path: string;
    initialInformation: string;
    supportedInformation: string;

}
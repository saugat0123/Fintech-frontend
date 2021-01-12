import {BaseEntity} from '../../../@core/model/base-entity';

export class AdditionalDocument extends BaseEntity {
    docName: string;
    docPath: string;
    uploadOn: Date;
    remarks: string;

}

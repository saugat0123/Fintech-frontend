import {CustomerType} from '../../customer/model/customerType';
import {DocStatus} from '../mdocconstant/doc-status';
import {BaseEntity} from '../../../@core/model/base-entity';

export class CoDoc extends BaseEntity{
    docName: string;
    docPath: string;
    docData: string;
    bookmarks: string;
    docStatus: DocStatus;
    customerType: CustomerType;
}

import {CustomerType} from '../../customer/model/customerType';
import {DocStatus} from '../mdocconstant/doc-status';

export class CoDoc {
    docName: string;
    docPath: string;
    docData: string;
    bookmarks: string;
    docStatus: DocStatus;
    customerType: CustomerType;
}

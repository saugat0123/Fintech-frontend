import { CustomerFather } from './customer-father';
import { CustomerGrandFather } from './customer-grand-father';
import { CustomerSpouse } from './customer-spouse';
import { CustomerRelative } from './customer-relative';

export class Customer {
    id: number;
    created: Date;
    lastModified: Date;
    title: string;
    customerName: string;
    customerId: string;
    accountNo: string;
    province: string;
    district: string;
    municipalitiesOrVDC: string;
    telephone: string;
    mobile: string;
    email: string;
    initialRelationDate: Date;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    issuedPlace: string;
    customerFather: CustomerFather;
    customerGrandFather: CustomerGrandFather;
    customerSpouse: CustomerSpouse;
    customerRelatives: Array<CustomerRelative>;
}

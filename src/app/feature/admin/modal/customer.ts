import {CustomerRelative} from './customer-relative';
import {MunicipalityVdc} from './municipality_VDC';
import {District} from './district';
import {Province} from './province';

export class Customer {
    id: number;
    created: Date;
    lastModified: Date;
    title: string;
    customerName: string;
    customerId: string;
    accountNo: string;
    province: Province;
    district: District;
    municipalities: MunicipalityVdc;
    street: string;
    wardNo: string;
    telephone: string;
    mobile: string;
    email: string;
    initialRelationDate: Date;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    citizenshipIssuedPlace: string;
    customerRelatives: Array<CustomerRelative>;
}

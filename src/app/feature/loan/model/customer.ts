import {Province} from '../../admin/modal/province';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {District} from '../../admin/modal/district';
import {Kyc} from './kyc';


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
    telephone: string;
    mobile: string;
    email: string;
    initialRelationDate: Date;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    issuedPlace: string;
    kyc: Kyc;
}

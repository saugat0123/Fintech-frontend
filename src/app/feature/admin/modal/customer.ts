import {CustomerRelative} from './customer-relative';
import {MunicipalityVdc} from './municipality_VDC';
import {District} from './district';
import {Province} from './province';

export class Customer {
    id: number;
    profilePic: string;
    customerName: string;
    dob: Date;
    province: Province;
    district: District;
    municipalities: MunicipalityVdc;
    street: string;
    wardNumber: string;
    contactNumber: string;
    email: string;
    initialRelationDate: Date;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    citizenshipIssuedPlace: string;
    status: string;
    customerRelatives: Array<CustomerRelative>;
    occupation: string;
    otherOccupation: string;
    incomeSource: string;
    otherIncome: string;
    nepaliDetail: string;
    version: number;
    introduction: string;
    customerCode: string;
    bankingRelationship: string;

}

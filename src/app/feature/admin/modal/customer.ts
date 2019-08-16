import {CustomerRelative} from './customer-relative';
import {MunicipalityVdc} from './municipality_VDC';
import {District} from './district';
import {Province} from './province';
import {Occupation} from './occupation';
import {IncomeSource} from './incomeSource';

export class Customer {
    id: number;
    title: string;
    customerName: string;
    dob: Date;
    customerId: string;
    accountNo: string;
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
    occupation: Occupation;
    incomeSource: IncomeSource;
    version: number;
}

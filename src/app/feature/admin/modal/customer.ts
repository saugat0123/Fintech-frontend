import {CustomerRelative} from './customer-relative';
import {MunicipalityVdc} from './municipality_VDC';
import {District} from './district';
import {Province} from './province';
import {Gender} from '../../../@core/model/enum/gender';
import {MaritalStatus} from '../../../@core/model/enum/marital-status';

export class Customer {
    id: number;
    profilePic: string;
    customerName: string;
    dob: Date;
    province: Province;
    district: District;
    municipalities: MunicipalityVdc;
    street: string;
    wardNumber: number;
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
    withinLimitRemarks: string;
    netWorth: number;
    subsectorDetail: string;
    clientType: string;
    landLineNumber: string;
    temporaryProvince: Province;
    temporaryDistrict: District;
    temporaryMunicipalities: MunicipalityVdc;
    temporaryWardNumber: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    customerLegalDocumentAddress: string;
    individualJsonData: string;
    jointInfo: string;
    isMicroCustomer: boolean;
    isJointCustomer: boolean;
    panNumber: string;
}

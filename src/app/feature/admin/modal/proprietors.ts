import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class Proprietors {
    name: string;
    contactNo: string;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
    share: number;
    holderPercentWardNumber: string;
    addressLine1: string;
    addressLine2: string;
    type: string;
    issuedDate: string;
    citizenshipNum: string;
    issuedPlace: string;
    dateOfBirth: string;
    kycInfo: any;
}

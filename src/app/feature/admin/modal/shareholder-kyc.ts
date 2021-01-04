import {District} from './district';

export class ShareholderKyc {
    id: number;
    shareholderRelationship: string;
    relationName: string;
    citizenshipNumber: string;
    district: District;
    citizenshipIssuedDate: Date;
    mobileNumber: string;
    shareholderKycAddress: string;
    version: string;
}

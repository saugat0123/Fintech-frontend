import {Gender} from '../../../@core/model/enum/gender';

export class ShareGuarantorJson {
    gender: Gender;
    passNumber: string;
    passIssueDate: Date;
    passIssuedPlace: string;
    panNumber: string;
    panIssueDate: Date;
    panIssuedPlace: string;
}

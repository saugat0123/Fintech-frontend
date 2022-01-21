import {Gender} from '../../../@core/model/enum/gender';

export class ShareGuarantorJson {
    gender: Gender;
    passNumber: string;
    passIssueDate: Date;
    passIssuedPlace: string;
    panNumber: string;
    panIssueDate: Date;
    panIssuedPlace: string;
    nationality: string;
    email: string;
    shareHolding: string;
    guarantor: string;
    managementTeam: string;
    managementDesignation: string;
    boardDirector: string;
    sharePercent: number;
    bodNumber: number;
    bodFemaleDirector: number;
    marginalisedDirector: number;
    femaleMarDirector: number;
    registrationNumber: number;
    registrationDate: Date;
    registrationWith: string;
    groupName: string;
}

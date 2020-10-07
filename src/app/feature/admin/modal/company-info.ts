import {LegalStatus} from './legal-status';
import {Capital} from './capital';
import {Swot} from './swot';
import {ManagementTeam} from './management-team';
import {Proprietors} from './proprietors';
import {BusinessType} from './businessType';
import {CompanyLocations} from './companyLocations';
import {ContactPerson} from './contact-person';

export class CompanyInfo {
    id: number;
    legalStatus: LegalStatus;
    capital: Capital;
    swot: Swot;
    companyLocations: CompanyLocations;
    managementTeamList: Array<ManagementTeam>;
    proprietorsList: Array<Proprietors>;
    companyName: string;
    registrationNumber: string;
    version: number;
    establishmentDate: Date;
    businessType: BusinessType;
    panNumber: string;
    contactPersons: string;
    profilePic: string;
    issuePlace: string;
    email: string;
    contactNum: string;
    additionalCompanyInfo: string;
    successionPlanning: string;
}

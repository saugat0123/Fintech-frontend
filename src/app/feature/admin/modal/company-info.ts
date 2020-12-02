import {LegalStatus} from './legal-status';
import {Capital} from './capital';
import {Swot} from './swot';
import {ManagementTeam} from './management-team';
import {Proprietors} from './proprietors';
import {BusinessType} from './businessType';
import {CompanyLocations} from './companyLocations';
import {RelationshipWithBank} from './relationship-with-bank';
import {LanguageType} from '../../customer/model/languageType';

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
    customerCode: string;
    bankingRelationship: string;
    industryGrowth: string;
    marketCompetition: string;
    experience: string;
    succession: string;
    businessAndIndustry: string;
    withinLimitRemarks: string;

    companyJsonData: string;
    subsectorDetail: string;
    clientType: string;
    landLineNumber: string;
    businessGiven: string;
    languageType: LanguageType;

}

import {LegalStatus} from './legal-status';
import {Capital} from './capital';
import {Swot} from './swot';
import {Proprietors} from './proprietors';
import {BusinessType} from './businessType';
import {CompanyLocations} from './companyLocations';
import {ShareholderKyc} from './shareholder-kyc';
import {CompanyContactDetail} from './crg/companyContactDetail';

export class CompanyInfo {
    id: number;
    legalStatus: LegalStatus;
    capital: Capital;
    swot: Swot;
    companyLocations: CompanyLocations;
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
    companyLegalDocumentAddress: string;
    shareholderKycList: Array<ShareholderKyc>;
    accountNo: string;
    accountStrategy: string;
    customerCategory: any;
    companyContactDetail: CompanyContactDetail;
}

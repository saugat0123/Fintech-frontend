import {Company} from './company';

export class LegalStatus {
    id: number;
    // companyName: string;
    corporateStructure: Company;
    registeredOffice: string;
    registeredUnderAct: string;
    // registrationNo: string;
    registrationDate: Date;
    panRegistrationOffice: string;
    // panNumber: string;
    panRegistrationDate: Date;
    registrationExpiryDate: Date;
}

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
    registrationNo: string;
    regIssuedPlace: string;
    vatRegistrationOffice: string;
    vatRegistrationDate: Date;
    registrationDistrict: string;
    udhyogBibhag: string;
    commercialDate: Date;
    requiredCommercialDate: Date;
}

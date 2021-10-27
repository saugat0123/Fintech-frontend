import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

export class CollateralSiteVisitDto {
    siteVisitDate: Date;
    securityName: string;
    siteVisitJsonData: string;
    siteVisitDocuments: Array<SiteVisitDocument>;
}

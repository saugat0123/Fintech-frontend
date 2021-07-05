import {BaseEntity} from '../../../../../@core/model/base-entity';
import {SiteVisitDocument} from './site-visit-document';

export class CollateralSiteVisit extends BaseEntity {
    siteVisitDate: Date;
    securityName: string;
    siteVisitJsonData: string;
    siteVisitDocuments: Array<SiteVisitDocument>;
}

import {BaseEntity} from '../../../../../@core/model/base-entity';

export class CollateralSiteVisit extends BaseEntity {
    siteVisitDate: Date;
    securityName: string;
    siteVisitJsonData: string;
}

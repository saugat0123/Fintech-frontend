import {BaseEntity} from '../../../@core/model/base-entity';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

export class SiteVisit extends BaseEntity {
  data?: string;
  siteVisitDocuments?: Array<SiteVisitDocument>;
}

import {SiteVisit} from '../../admin/modal/siteVisit';
import {Financial} from './financial';
import {Security} from './security';
import {GuarantorDetail} from './guarantor-detail';
import {Insurance} from '../../admin/modal/insurance';
import {Document} from '../../admin/modal/document';
import {CustomerGeneralDocument} from '../../customer/model/customerGeneralDocument';
import {CustomerGroup} from '../../admin/modal/customer-group';

export class CustomerInfoData {
  id: number;
  name: string;
  idType: any;
  idNumber: string;
  customerType: any;
  idRegDate: any;
  contactNo: string;
  email: string;
  idRegPlace: string;
  associateId: number;
  isBlacklist: boolean;
  siteVisit: SiteVisit;
  financial: Financial;
  version: number;
  security: Security;
  shareSecurity;
  guarantors: GuarantorDetail;
  insurance: Array<Insurance>;
  customerGeneralDocuments: Array<CustomerGeneralDocument>;
  customerGroup: CustomerGroup;

}

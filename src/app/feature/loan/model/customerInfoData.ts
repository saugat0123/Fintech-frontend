import {SiteVisit} from '../../admin/modal/siteVisit';
import {Financial} from './financial';
import {Security} from './security';
import {GuarantorDetail} from './guarantor-detail';
import {Insurance} from '../../admin/modal/insurance';
import {CustomerGeneralDocument} from '../../customer/model/customerGeneralDocument';
import {CustomerGroup} from '../../admin/modal/customer-group';
import {CreditRiskGradingAlpha} from '../../admin/modal/CreditRiskGradingAlpha';
import {CreditRiskGrading} from '../../admin/modal/creditRiskGrading';
import {Branch} from '../../admin/modal/branch';

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
  branch: Branch;
  siteVisit: SiteVisit;
  financial: Financial;
  creditRiskGradingAlpha: CreditRiskGradingAlpha;
  creditRiskGrading: CreditRiskGrading;
  version: number;
  security: Security;
  shareSecurity;
  guarantors: GuarantorDetail;
  insurance: Array<Insurance>;
  customerGeneralDocuments: Array<CustomerGeneralDocument>;
  customerGroup: CustomerGroup;

}

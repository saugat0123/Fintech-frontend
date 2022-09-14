import {OtherCompanyDetail} from './otherCompanyDetail';
import {Swot} from './swot';
import {Proprietors} from './proprietors';
import {ReviewDate} from './reviewDate';

export class CompanyJsonData {

  otherCompanyDetail: OtherCompanyDetail = undefined;
  sisterConcern: Array<any> = new Array<any>();
  majorProductService: string = undefined;
  relationshipSince: string = undefined;
  companyBackground: string = undefined;
  businessObjective: string = undefined;
  rawMaterialSourcing: string = undefined;
  rawMaterialAvailability: string = undefined;
  marketScenario: string = undefined;
  groupsBackGround: string = undefined;
  legalReviewRemark: string = undefined;
  businessGiven: string = undefined;
  swot: Swot;
  proprietorList: Array<Proprietors> = new Array<Proprietors>();
  microCustomerDetail: any;
  totalSharePercent: string;
  addressLegalDocument: string;
  businessManagementRisk: string;
  BusinessIndustryOutlook: string;
  relationshipSinceWithCustomer: string = undefined;
  irdReport: string;
  accountDetails: any;
  branchAddress: string = undefined;
  warehouseAddress: string = undefined;
  companyBackgroundBusiness: string = undefined;
  promotersKeyPersons: string = undefined;
  promoterBackground: string = undefined;
  lineOfBusiness: string = undefined;
  discriptionWithComment: string = undefined;
  majorBuyersSuppliers: string = undefined;
  group: string = undefined;
  // loanType: string = undefined;
  reviewDate: string = undefined;
  promoterNetWorth: string;
  vision: string;
  promoterStructure: string;
  business: string;
  sameAddress: boolean;
}

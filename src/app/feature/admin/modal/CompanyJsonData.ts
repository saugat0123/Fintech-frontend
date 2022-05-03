import {OtherCompanyDetail} from './otherCompanyDetail';
import {ManagementTeam} from './management-team';
import {Swot} from './swot';
import {Proprietors} from './proprietors';
import {ReviewDate} from './reviewDate';

export class CompanyJsonData {

  otherCompanyDetail: OtherCompanyDetail = undefined;
  sisterConcern: Array<any> = new Array<any>();
  majorProductService: string = undefined;
  relationshipSince: string = undefined;
  companyBackground: string = undefined;
  managementTeamNote: string = undefined;
  businessObjective: string = undefined;
  rawMaterialSourcing: string = undefined;
  rawMaterialAvailability: string = undefined;
  marketScenario: string = undefined;
  groupsBackGround: string = undefined;
  legalReviewRemark: string = undefined;
  businessGiven: string = undefined;
  managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
  swot: Swot;
  proprietorList: Array<Proprietors> = new Array<Proprietors>();
  microCustomerDetail: any;
  totalSharePercent: string;
  isAdditionalCompanyInfo: boolean;
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
  reviewDate: ReviewDate = undefined;
  promoterNetWorth: string;
  business: string;
}

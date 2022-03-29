import {OtherCompanyDetail} from './otherCompanyDetail';
import {ManagementTeam} from './management-team';
import {Swot} from './swot';
import {Proprietors} from './proprietors';

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
}

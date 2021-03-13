import {OtherCompanyDetail} from './otherCompanyDetail';
import {ManagementTeam} from './management-team';
import {Swot} from './swot';
import {Proprietors} from './proprietors';

export class CompanyJsonData {

  otherCompanyDetail: OtherCompanyDetail = undefined;
  sisterConcern: string = undefined;
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
  microCustomerDetail: string;
}

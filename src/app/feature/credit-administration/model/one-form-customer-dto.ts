import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {CustomerRelative} from '../../admin/modal/customer-relative';
import {MaritalStatus} from '../../../@core/model/enum/marital-status';
import {LegalStatus} from '../../admin/modal/legal-status';
import {Capital} from '../../admin/modal/capital';
import {CompanyLocations} from '../../admin/modal/companyLocations';
import {ManagementTeam} from '../../admin/modal/management-team';
import {Proprietors} from '../../admin/modal/proprietors';
import {BusinessType} from '../../admin/modal/businessType';
import {CustomerSubType} from '../../customer/model/customerSubType';

export class OneFormCustomerDto {
  customerInfoId: number;
  customerCode: string;
  customerName: string;
  dob: Date;
  province: Province;
  district: District;
  municipalities: MunicipalityVdc;
  street: string;
  wardNumber: number;
  contactNumber: string;
  email: string;
  initialRelationDate: Date;
  citizenshipNumber: string;
  citizenshipIssuedDate: Date;
  citizenshipIssuedPlace: string;
  status: string;
  customerRelatives: Array<CustomerRelative>;
  occupation: string;
  otherOccupation: string;
  incomeSource: string;
  otherIncome: string;
  nepaliDetail: string;
  version: number;
  introduction: string;
  bankingRelationship: string;
  withinLimitRemarks: string;
  netWorth: number;
  subsectorDetail: string;
  clientType: string;
  landLineNumber: string;
  temporaryProvince: Province;
  temporaryDistrict: District;
  temporaryMunicipalities: MunicipalityVdc;
  temporaryWardNumber: string;
  gender: string;
  maritalStatus: MaritalStatus;
  customerLegalDocumentAddress: string;
  individualJsonData: string;

  legalStatus: LegalStatus;
  capital: Capital;
  companyLocations: CompanyLocations;
  managementTeamList: Array<ManagementTeam>;
  proprietorsList: Array<Proprietors>;
  companyName: string;
  registrationNumber: string;
  establishmentDate: Date;
  businessType: BusinessType;
  panNumber: string;
  contactPersons: string;
  profilePic: string;
  issuePlace: string;
  experience: string;
  succession: string;
  companyJsonData: string;
  companyLegalDocumentAddress: string;
  jointInfo: string;
  isJointCustomer: Boolean;
  customerSubType: CustomerSubType;

}

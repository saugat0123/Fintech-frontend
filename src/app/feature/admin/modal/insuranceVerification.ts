import {InspectingStaff} from './inspectingStaff';

export class InsuranceVerification {
  assetsMortgaged: string;
  insuredAmount: number;
  insuranceCompany: string;
  expiryDate: Date;
  clientRating: string;
  comments: string;
  stockValueConfirmed: number;
  inspectingStaffList: Array<InspectingStaff> = new Array<InspectingStaff>();
}

import {InspectingStaff} from './inspectingStaff';
import {PartyInfo} from './partyInfo';

export class CurrentAssetsInspection {
  dateOfInspection: Date;
  particularsOfGoodInspected: string;
  stockValueReported: number;
  rents: string;
  rentPmtUpToDate: string;
  rentReceiptUpToDate: string;
  assetsMortgaged: string;
  insuredAmount: number;
  insuranceCompany: string;
  expiryDate: Date;
  clientsOverAllRating: string;
  insuranceVerificationComments: string;
  stockValueConfirmed: number;
  inspectingStaff: Array<InspectingStaff>;
  insuranceVerificationPosition: string;
  uptoDateWithCharges: boolean;
  borrowersPossession: boolean;
  notUnderTR: boolean;
  otherBankNotInterested: boolean;
  securityOrder: boolean;
  goodsSaleable: boolean;
  stocksUptoDate: boolean;
  matchWithTheStockList: boolean;
  storageConditionSatisfactory: boolean;
  fireFightingEvidence: boolean;
  buildingStoreCondition: boolean;
  warrantiesUptoDate: boolean;
  noHazardousNature: boolean;
  nameBoardProperlyDisplayed: boolean;
  padlocksUse: boolean;
  findingAndComments: string;
  remarksForNoOption: string;
}

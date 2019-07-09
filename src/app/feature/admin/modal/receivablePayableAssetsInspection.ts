import {InspectingStaff} from './inspectingStaff';
import {PartyInfo} from './partyInfo';
import {ReceivableCurrentAssets} from './receivableCurrentAssets';
import {PayableCurrentAssets} from './payableCurrentAssets';
import {BankExposureAssets} from './bankExposureAssets';

export class ReceivablePayableAssetsInspection {
  partyInfoList: Array<PartyInfo>;
  threeMonthTotal: number;
  sixMonthTotal: number;
  oneYearTotal: number;
  moreThanOneYearTotal: number;
  findingAndComments: string;
  receivableCurrentAssetsList: Array<ReceivableCurrentAssets>;
  payableCurrentAssetsList: Array<PayableCurrentAssets>;
  bankExposureAssetsList: Array<BankExposureAssets>;
  inspectingStaffList: Array<InspectingStaff>;
  overallFindingAndCommentsOfCAI: string;
  findingsAndCommentsForCurrentAssetsInspection: string;
}

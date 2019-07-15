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
  findingsAndCommentsForCurrentAssetsInspection: string;
  receivableCurrentAssetsList: Array<ReceivableCurrentAssets>;
  receivableCurrentAssetsTotal: number;
  payableCurrentAssetsList: Array<PayableCurrentAssets>;
  payableCurrentAssetsTotal: number;
  inspectingStaffList: Array<InspectingStaff>;
  bankExposureAssetsList: Array<BankExposureAssets>;
  overallFindingAndCommentsOfCAI: string;
}

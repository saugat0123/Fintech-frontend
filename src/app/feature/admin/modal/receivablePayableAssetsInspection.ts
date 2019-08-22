import {InspectingStaff} from './inspectingStaff';
import {PartyInfo} from './partyInfo';
import {ReceivableCurrentAssets} from './receivableCurrentAssets';
import {PayableCurrentAssets} from './payableCurrentAssets';
import {BankExposureAssets} from './bankExposureAssets';

export class ReceivablePayableAssetsInspection {
  partyInfoList: Array<PartyInfo> = new Array<PartyInfo>();
  threeMonthTotal: number;
  sixMonthTotal: number;
  oneYearTotal: number;
  moreThanOneYearTotal: number;
  findingsAndCommentsForCurrentAssetsInspection: string;
  receivableCurrentAssetsList: Array<ReceivableCurrentAssets> = new Array<ReceivableCurrentAssets>();
  receivableCurrentAssetsTotal: number;
  payableCurrentAssetsList: Array<PayableCurrentAssets> = new Array<PayableCurrentAssets>();
  payableCurrentAssetsTotal: number;
  inspectingStaffList: Array<InspectingStaff> = new Array<InspectingStaff>();
  bankExposureAssetsList: Array<BankExposureAssets> = new Array<BankExposureAssets>();
  overallFindingAndCommentsOfCAI: string;
}

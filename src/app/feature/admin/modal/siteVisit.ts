import {BusinessSiteVisit} from './businessSiteVisit';
import {AssetsInspection} from './assetsInspection';
import {ReceivablePayableAssetsInspection} from './receivablePayableAssetsInspection';
import {FixedAssetsCollateral} from './fixedAssetsCollateral';
import {CurrentResident} from './currentResident';
import {CurrentAssetsInspection} from './currentAssetsInspection';

export class SiteVisit {
  hasCurrentResident: boolean;
  hasBusinessSiteVisit: boolean;
  hasFixedAssetsCollateral: boolean;
  hasCurrentAssetsInspection: boolean;
  currentResident: CurrentResident;
  businessSiteVisit: BusinessSiteVisit;
  fixedAssetsCollateral: FixedAssetsCollateral;
  currentAssetsInspection: CurrentAssetsInspection;
  assetsInspection: AssetsInspection;
  receivablePayableAssetsInspection: ReceivablePayableAssetsInspection;

}

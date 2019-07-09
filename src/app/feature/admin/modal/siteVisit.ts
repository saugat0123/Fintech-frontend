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
  businessSiteVisit: BusinessSiteVisit;
  assetsInspection: AssetsInspection;
  receivablePayableAssetsInspection: ReceivablePayableAssetsInspection;
  fixedAssetsCollateral: FixedAssetsCollateral;
  currentResident: CurrentResident;
  currentAssetsInspection: CurrentAssetsInspection;
}

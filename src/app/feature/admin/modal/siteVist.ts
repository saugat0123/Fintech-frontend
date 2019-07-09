import {BusinessSiteVisit} from './businessSiteVisit';
import {AssetsInspection} from './assetsInspection';
import {ReceivablePayableAssetsInspection} from './receivablePayableAssetsInspection';
import {FixedAssetsCollateral} from './fixedAssetsCollateral';
import {CurrentResident} from './currentResident';
import {CurrentAssetsInspection} from './currentAssetsInspection';

export class SiteVist {
  hasCurrentResident: boolean;
  hasBusinessSiteVisit: boolean;
  hasFixedAssetsCollateral: boolean;
  hasCurrentAssetsInspection: boolean;
  businessSiteVisit: BusinessSiteVisit;
  assetsInspection: AssetsInspection;
  receivalblePayableAssetsInspection: ReceivablePayableAssetsInspection;
  fixedAssetsCollateral: FixedAssetsCollateral;
  currentResident: CurrentResident;
  currentAssetsInspection: CurrentAssetsInspection;
}

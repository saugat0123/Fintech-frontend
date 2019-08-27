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
  currentResident: CurrentResident = new CurrentResident();
  businessSiteVisit: BusinessSiteVisit = new BusinessSiteVisit();
  fixedAssetsCollateral: FixedAssetsCollateral = new FixedAssetsCollateral();
  assetsInspection: AssetsInspection = new AssetsInspection();
  currentAssetsInspection: CurrentAssetsInspection = new CurrentAssetsInspection();
  receivablePayableAssetsInspection: ReceivablePayableAssetsInspection = new ReceivablePayableAssetsInspection();

}

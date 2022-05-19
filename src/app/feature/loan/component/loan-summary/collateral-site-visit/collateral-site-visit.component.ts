import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {Security} from '../../../model/security';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';

@Component({
  selector: 'app-collateral-site-visit',
  templateUrl: './collateral-site-visit.component.html',
  styleUrls: ['./collateral-site-visit.component.scss']
})
export class CollateralSiteVisitComponent implements OnInit {

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }
  @Input() loanDataHolder: LoanDataHolder;
  url;
  securityData;
  collateralSiteVisits = [];
    vehicleSelected = false;
    landSelected = false;
    hypothecation = false;
    corporate = false;
    personal = false;
    apartmentSelected = false;
    plantSelected = false;
    depositSelected = false;
    totalAmount = 0;
    shareSelected = false;
    insurancePolicySelected = false;
    shareTotalValue = 0;
    totalConsideredValue = 0;
    loanSharePercent: NepseMaster = new NepseMaster();
    landBuilding = false;
    isSecurityPresent = false;
    isCollateralSiteVisitPresent = false;
    assignments: any;
    assignment = false;
    securityOther = false;
    siteVisitDocuments: Array<SiteVisitDocument>;
    separator = '/';
    fileType = '.jpg';
    isPrintable = 'YES';
    siteVisitJson = [];
    random;
    security: Security;
    ownerShipTransfer = OwnershipTransfer;
  ngOnInit() {
      this.url = ApiConfig.URL;
      this.random = Math.floor(Math.random() * 100) + 1;
  }
    viewDocument(url: string, name: string) {
        const viewDocName = name.concat(this.fileType);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {Security} from '../../../model/security';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {
    CollateralSiteVisit
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';

@Component({
  selector: 'app-collateral-site-visit',
  templateUrl: './collateral-site-visit.component.html',
  styleUrls: ['./collateral-site-visit.component.scss']
})
export class CollateralSiteVisitComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  url;
  securityData;
  siteVisitDocuments = [];
  separator = '/';
  fileType = '.jpg';
  isPrintable = 'YES';
  siteVisitJson = [];
  random;
  security: Security;
  isCollateralSiteVisitPresent = false;

  constructor() {
  }

  ngOnInit() {
      this.url = ApiConfig.URL;
      this.random = Math.floor(Math.random() * 100) + 1;
      if (!ObjectUtil.isEmpty(this.loanDataHolder.securities)) {
          this.loanDataHolder.securities.map(value => {
              value.data = JSON.parse(value.data);
              value.collateralSiteVisits =  value.collateralSiteVisits.map(value1 => {
                  value1.siteVisitJsonData = JSON.parse(value1.siteVisitJsonData);
                  return value1;
              });
              return value;
          });
          this.loanDataHolder.securities.forEach((security: Security) => {
              if (!ObjectUtil.isEmpty(security.collateralSiteVisits)) {
                  this.isCollateralSiteVisitPresent = true;
                 /* security.collateralSiteVisits.forEach((collateralSiteVisit: CollateralSiteVisit) => {
                      this.siteVisitJson.push(JSON.parse(collateralSiteVisit.siteVisitJsonData));
                      if (!ObjectUtil.isEmpty(collateralSiteVisit.siteVisitDocuments)) {
                          collateralSiteVisit.siteVisitDocuments.forEach((siteVisitDocument: SiteVisitDocument) => {
                              this.siteVisitDocuments.push(siteVisitDocument);
                          });
                      }
                  });*/
              }
          });
      }
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

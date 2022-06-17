import {Component, DoCheck, Input, IterableDiffers, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {
  CollateralSiteVisit
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {
  SiteVisitDocument
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-annexure-one',
  templateUrl: './annexure-one.component.html',
  styleUrls: ['./annexure-one.component.scss']
})
export class AnnexureOneComponent implements OnInit, DoCheck {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() fixedAssetsData;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitDocuments = [];
  siteVisitJson = [];
  isPrintable = 'YES';
  url: string;
  separator = '/';
  fileType = '.jpg';
  random;
  iterableDiffer;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    this.random = Math.floor(Math.random() * 100) + 1;
    this.url = ApiConfig.URL;
  }

  viewDocumentAnnex(url: string, name: string) {
    const viewDocName = name.concat(this.fileType);
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  public onError(event): void {
    event.target.src = 'assets/img/noImage.png';
  }

  ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.fixedAssetsData);
    if (changes) {
      this.siteVisitJson = [];
      this.siteVisitDocuments = [];
      this.collateralSiteVisits = [];
      if (!ObjectUtil.isEmpty(this.fixedAssetsData)) {
        // code to get recent site visit information as fixedAssetsData json contain sorted data by sitevisitdate order by DESC
        const map = new Map();
        this.fixedAssetsData.forEach(f => {
          const securityName = f.securityName;
          if (!map.has(securityName)) {
            this.collateralSiteVisits.push(f);
          }
          map.set(securityName, securityName);
        });
        const siteVisitDoc = [];
        this.collateralSiteVisits.forEach(f => {
          const doc = [];
          if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
            f.siteVisitDocuments.forEach((sv: SiteVisitDocument) => {
              if (sv.isPrintable === this.isPrintable) {
                doc.push(sv);
              }
            });
          }
          siteVisitDoc.push(doc);
        });
        this.siteVisitDocuments = siteVisitDoc;
        if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
          const collateralData = this.collateralSiteVisits.reverse();
          collateralData.filter(item => {
            this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
          });
        } else {
          this.collateralSiteVisits.filter(item => {
            this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
          });
        }
      }
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

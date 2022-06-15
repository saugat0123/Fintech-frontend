import {Component, DoCheck, Input, IterableDiffers, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {flatten} from '@angular/compiler';
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
  siteVisitDocuments: Array<SiteVisitDocument>;
  siteVisitJson = [];
  isPrintable = 'YES';
  url: string;
  separator = '/';
  fileType = '.jpg';
  random;
  iterableDiffer;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);}

  ngOnInit() {
    this.random = Math.floor(Math.random() * 100) + 1;
    this.url = ApiConfig.URL;
  }

  viewDocument(url: string, name: string) {
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
      if (!ObjectUtil.isEmpty(this.fixedAssetsData)) {
        this.collateralSiteVisits = this.fixedAssetsData;
        const doc = [];
        this.collateralSiteVisits.forEach(f => {
          if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
            doc.push(f.siteVisitDocuments);
          }
        });
        // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
        const docArray = flatten(doc);
        // filter for only printable document
        this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);

        this.collateralSiteVisits.filter(item => {
          this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
        });
      }
    }
  }


}

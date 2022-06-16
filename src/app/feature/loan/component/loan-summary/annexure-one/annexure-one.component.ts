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
  siteVisitDocuments = [];
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
          let map = new Map();
          this.fixedAssetsData.forEach(f => {
            const securityName = f.securityName;
            if (!map.has(securityName)) {
              this.collateralSiteVisits.push(f);
            }
            map.set(securityName, securityName);
          });
        console.log(this.collateralSiteVisits, ' collateral site');
        const siteVisitDoc = [];
        this.collateralSiteVisits.forEach(f => {
          const doc = [];
          if (f.siteVisitDocuments.length > 0) {
            f.siteVisitDocuments.forEach((sv: SiteVisitDocument) => {
              doc.push(sv);
            });
          }
          if (doc.length > 0) {
            siteVisitDoc.push(doc);
          }
        });
        this.siteVisitDocuments = siteVisitDoc;
        // console.log('siteVisitDoc siteVisitDoc', siteVisitDoc);
        // siteVisitDoc.forEach((site: Array<SiteVisitDocument>) => {
        //   console.log('s s', s);
        //   s.fil(f => f.isPrintable === this.isPrintable);
        // });

        // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
        // const docArray = flatten(doc);
        // // filter for only printable document
        // this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);
        console.log(this.siteVisitDocuments, 'siteVisitDocuemtns');

        this.collateralSiteVisits.filter(item => {
          this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
        });

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

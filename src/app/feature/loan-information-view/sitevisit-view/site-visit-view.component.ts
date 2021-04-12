import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';

@Component({
  selector: 'app-site-visit-view',
  templateUrl: './site-visit-view.component.html',
  styleUrls: ['./site-visit-view.component.scss']
})
export class SiteVisitViewComponent implements OnInit {
  @Input() siteVisit: any;
  currentResidentSummary = false;
  businessSiteVisitSummary = false;
  fixedAssetCollateralSummary = false;
  currentAssetsInspectionSummary = false;
  client = environment.client;
  clientName = Clients;
  constructor() { }

  formData: any;
  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.siteVisit)) {
     this.formData = JSON.parse( this.siteVisit.data);
          switch (this.formData['checkboxSelected']) {
            case 'currentResidentFormChecked' :
              this.currentResidentSummary = true;
              break;
            case 'businessSiteVisitFormChecked' :
              this.businessSiteVisitSummary = true;
              break;
            case 'fixedAssetCollateralFormChecked' :
              this.fixedAssetCollateralSummary = true;
              break;
            case 'currentAssetsInspectionFormChecked' :
              this.currentAssetsInspectionSummary = true;
      }
    }
    console.log(this.formData, 'Data');
    }

}

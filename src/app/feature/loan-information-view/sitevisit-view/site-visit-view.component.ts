import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-site-visit-view',
    templateUrl: './site-visit-view.component.html',
    styleUrls: ['./site-visit-view.component.scss']
})
export class SiteVisitViewComponent implements OnInit {
    @Input() siteVisit: any;
    @Input() fixedAssetsData: Array<any>;
    currentResidentSummary = false;
    businessSiteVisitSummary = false;
    fixedAssetCollateralSummary = false;
    currentAssetsInspectionSummary = false;
    isRentedLeased = false;
    isNotRentedLeased = false;
    rentedLeasedArray: Array<any> = new Array<any>();
    notRentedLeasedArray: Array<any> = new Array<any>();
    landSelected = false;
    apartmentSelected = false;
    landBuilding = false;

    constructor() {
    }

    formData: any;

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.siteVisit)) {
            this.formData = JSON.parse(this.siteVisit.data);
            switch (this.formData['checkboxSelected']) {
                case 'currentResidentFormChecked' :
                    this.currentResidentSummary = true;
                    break;
                case 'businessSiteVisitFormChecked' :
                    this.businessSiteVisitSummary = true;
                    break;
                case 'currentAssetsInspectionFormChecked' :
                    this.currentAssetsInspectionSummary = true;
            }
            if (!ObjectUtil.isEmpty(this.formData) &&
                !ObjectUtil.isEmpty(this.formData['currentAssetsInspectionDetails'])) {
                this.formData['currentAssetsInspectionDetails'].forEach(val => {
                    if (val.rents === 'Rented/Leased') {
                        this.isRentedLeased = true;
                        this.rentedLeasedArray.push(val);
                    } else {
                        this.isNotRentedLeased = true;
                        this.notRentedLeasedArray.push(val);
                    }
                });
            }
        }
    }

}

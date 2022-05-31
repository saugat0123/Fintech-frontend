import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanType} from '../../../model/loanType';

@Component({
    selector: 'app-sitevist-summary-component',
    templateUrl: './sitevist-summary-component.component.html',
    styleUrls: ['./sitevist-summary-component.component.scss']
})
export class SitevistSummaryComponentComponent implements OnInit {
    @Input() formData: Object;
    @Input() loanType;
    @Input() loanTypeView: any;
    currentResidentSummary = false;
    businessSiteVisitSummary = false;
    fixedAssetCollateralSummary = false;
    currentAssetsInspectionSummary = false;
    isBusinessLoanType = false;
    loanTypeEnum = LoanType;

    constructor() {
    }

    ngOnInit() {
        if (this.loanType === 'INSTITUTION') {
            this.isBusinessLoanType = true;
        }
        if (!ObjectUtil.isEmpty(this.formData)) {
            {
                switch (this.formData['checkboxSelected']) {
                    case 'currentResidentFormChecked' :
                        this.currentResidentSummary = true;
                        console.log('this.currentResidentSummary');
                        break;
                    case 'businessSiteVisitFormChecked' :
                        this.businessSiteVisitSummary = true;
                        console.log(this.businessSiteVisitSummary);
                        break;
                    case 'fixedAssetCollateralFormChecked' :
                        this.fixedAssetCollateralSummary = true;
                        console.log(this.fixedAssetCollateralSummary);
                        break;
                    case 'currentAssetsInspectionFormChecked' :
                        this.currentAssetsInspectionSummary = true;
                        console.log(this.currentAssetsInspectionSummary);
                }
            }
        }
    }

}

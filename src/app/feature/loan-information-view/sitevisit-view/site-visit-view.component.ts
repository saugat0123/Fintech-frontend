import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {SummaryType} from '../../loan/component/SummaryType';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {DmsLoanService} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {ToastService} from '../../../@core/utils';

@Component({
    selector: 'app-site-visit-view',
    templateUrl: './site-visit-view.component.html',
    styleUrls: ['./site-visit-view.component.scss']
})
export class SiteVisitViewComponent implements OnInit {
    @Input() siteVisit: any;
    @Input() loanDataHolder;
    currentResidentSummary = false;
    businessSiteVisitSummary = false;
    fixedAssetCollateralSummary = false;
    currentAssetsInspectionSummary = false;
    client = environment.client;
    clientName = Clients;
    summaryType = environment.summaryType;
    summaryTypeName = SummaryType;
    siteVisitDoc = [];

    constructor(private dmsLoanService: DmsLoanService,
                private toastService: ToastService) {
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
                case 'fixedAssetCollateralFormChecked' :
                    this.fixedAssetCollateralSummary = true;
                    break;
                case 'currentAssetsInspectionFormChecked' :
                    this.currentAssetsInspectionSummary = true;
            }
        }
    }

}

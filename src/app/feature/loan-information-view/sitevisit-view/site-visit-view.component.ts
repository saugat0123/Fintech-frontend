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
            console.log('formData', this.formData);
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
            this.siteVisitDoc = JSON.parse(this.siteVisit.docPath);
        }
    }

    preview(url: string, name: string): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    downloadDocument(documentPath, documentName) {
        this.dmsLoanService.downloadDocument(documentPath).subscribe(
            (response: any) => {
                const downloadUrl = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = downloadUrl;
                const toArray = documentPath.split('.');
                const extension = toArray[toArray.length - 1];
                link.download = documentName + '.' + extension;
                link.click();
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'File not Found'));
            }
        );
    }

}

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';

@Component({
    selector: 'app-financial-upload-view',
    templateUrl: './financial-upload-view.component.html',
    styleUrls: ['./financial-upload-view.component.scss']
})
export class FinancialUploadViewComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() customerInfoId;
    form: FormGroup;
    uploadFile;
    fg = new FormData();

    constructor(
        private activeRoutes: ActivatedRoute,
        private customerInfoService: CustomerInfoService,
        private formBuilder: FormBuilder
    ) {
    }
    financialData;
    balanceSheet;
    executiveSummary;
    plAccount;
    commonSizePl;
    detailCf;
    ngOnInit() {
        this.buildForm();
        this.financialData = JSON.parse(this.customerInfo.financial.data);
        this.balanceSheet = JSON.parse(this.financialData.balanceSheetData);
        this.executiveSummary = JSON.parse(this.financialData.executiveSummaryData);
        this.plAccount = JSON.parse(this.financialData.plAccountData);
        this.commonSizePl = JSON.parse(this.financialData.commonSizePlData);
        this.detailCf = JSON.parse(this.financialData.cashFlowData);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            upload: [undefined]
        });
    }

    upload(event) {
        this.uploadFile = event.target.files[0];
        console.log('this is the file', event.target.files[0]);
        this.fg.append('file', this.uploadFile);
        this.fg.append('customerId', this.customerInfoId);
    }

    submitData() {
        this.customerInfoService.uploadFinancialExcel(this.fg).subscribe(res => {
            console.log('this is response', res);
        });
    }
    onChangeTab(event) {
        console.log('this is event', event);
    }
}

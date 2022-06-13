import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ToastService} from '../../../@core/utils';
import {CommonService} from '../../../@core/service/common.service';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CalendarType} from '../../../@core/model/calendar-type';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';

@Component({
    selector: 'app-crg-ccbl',
    templateUrl: './crg-ccbl.component.html',
    styleUrls: ['./crg-ccbl.component.scss']
})
export class CrgCcblComponent implements OnInit {
    constructor(
        private spinner: NgxSpinnerService,
        private customerInfoService: CustomerInfoService,
        protected fiscalYearService: FiscalYearService,
        private toastService: ToastService,
        public commonService: CommonService) {
    }

    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile;
    @Output() eventEmitter = new EventEmitter();
    formData: FormData = new FormData();
    obtainedScore;
    file;
    data;
    restUrl = ApiConfig.URL;
    thresholdPoint: string;
    thresholdOutcome: string;
    calenderType = CalendarType.AD;
    fiscalYearArray = new Array<FiscalYear>();
    selectedFiscalYear: string;

    ngOnInit() {
        this.getFiscalYear();
        if (!ObjectUtil.isEmpty(this.customerInfo.crgCcbl)) {
            this.data = JSON.parse(this.customerInfo.crgCcbl);
            this.obtainedScore = this.data.data;
            this.selectedFiscalYear = this.data.selectedFiscalYear;
            this.thresholdPoint = this.data.thresholdPoint;
            this.thresholdOutcome = this.data.thresholdOutcome;
        }
    }
    getFiscalYear() {
        this.fiscalYearService.getAll().subscribe(response => {
           this.fiscalYearArray = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
    }

    upload(event) {
        this.file = event.target.files[0];
    }

    save() {
        if (!ObjectUtil.isEmpty(this.file)) {
            this.formData.append('file', this.file);
            this.formData.append('customerInfoId', this.customerInfo.id.toString());
            this.formData.append('type', 'crgCCBL');
            this.spinner.show();
            if (!ObjectUtil.isEmpty(this.formData)) {
                this.customerInfoService.saveCcbl(this.formData).subscribe((res: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved CRG CCBL'));
                    const data = {
                        file: res.detail,
                        data: this.obtainedScore,
                        selectedFiscalYear: this.selectedFiscalYear,
                        thresholdPoint: this.thresholdPoint,
                        thresholdOutcome: this.thresholdOutcome
                    };
                    this.eventEmitter.emit(JSON.stringify(data));
                    this.spinner.hide();
                }, (error) => {
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save CRG CCBL'));
                    this.spinner.hide();
                });
            } else {
                this.spinner.hide();
            }
        } else {
            const data = {
                file: this.data.file ? this.data.file : '',
                data: this.obtainedScore,
                selectedFiscalYear: this.selectedFiscalYear,
                thresholdPoint: this.thresholdPoint,
                thresholdOutcome: this.thresholdOutcome
            };
            this.eventEmitter.emit(JSON.stringify(data));
        }
    }

    calculateCCBL() {
        if (this.obtainedScore >= 90) {
            this.thresholdPoint = 'CCBL 1';
        } else if (this.obtainedScore >= 80) {
            this.thresholdPoint = 'CCBL 2';
        } else if (this.obtainedScore >= 70) {
            this.thresholdPoint = 'CCBL 3';
        } else if (this.obtainedScore >= 60) {
            this.thresholdPoint = 'CCBL 4';
        } else if (this.obtainedScore >= 45) {
            this.thresholdPoint = 'CCBL 5';
        } else if (this.obtainedScore >= 35) {
            this.thresholdPoint = 'CCBL 6';
        } else if (this.obtainedScore >= 25) {
            this.thresholdPoint = 'CCBL 7';
        } else {
            this.thresholdPoint = 'CCBL 8';
        }
        if (!ObjectUtil.isEmpty(this.thresholdPoint)) {
            if (this.thresholdPoint === 'CCBL 8') {
                this.thresholdOutcome = 'Decline for new relationship/Exit strategy for Existing relationship';
            } else {
                this.thresholdOutcome = 'Fit';
            }
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ToastService} from '../../../@core/utils';
import {CommonService} from '../../../@core/service/common.service';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';

@Component({
    selector: 'app-crg-ccbl',
    templateUrl: './crg-ccbl.component.html',
    styleUrls: ['./crg-ccbl.component.scss']
})
export class CrgCcblComponent implements OnInit {
    constructor(
        private spinner: NgxSpinnerService,
        private customerInfoService: CustomerInfoService,
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

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo.crgCcbl)) {
            this.data = JSON.parse(this.customerInfo.crgCcbl);
            this.obtainedScore = this.data.data;
        }
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
                        data: this.obtainedScore
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
                data: this.obtainedScore
            };
            this.eventEmitter.emit(JSON.stringify(data));
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-financial-upload-view',
    templateUrl: './financial-upload-view.component.html',
    styleUrls: ['./financial-upload-view.component.scss']
})
export class FinancialUploadViewComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() customerInfoId;
    @Output() customer = new EventEmitter();
    @Input() sensitive;
    @Input() fromProfile: boolean;
    form: FormGroup;
    uploadFile;
    fg = new FormData();
    financialKeys;
    spinner = false;
    financialData;
    ckeConfig = Editor.CK_CONFIG;

    constructor(
        private activeRoutes: ActivatedRoute,
        private customerInfoService: CustomerInfoService,
        private formBuilder: FormBuilder,
        private toast: ToastService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.financial)) {
                if (this.sensitive) {
                    if (!ObjectUtil.isEmpty(this.customerInfo.financial.sensitive)) {
                        this.financialData = JSON.parse(this.customerInfo.financial.sensitive);
                    }
                } else {
                    if (!ObjectUtil.isEmpty(this.customerInfo.financial.data)) {
                        this.financialData = JSON.parse(this.customerInfo.financial.data);
                    }
                }
                if (!ObjectUtil.isEmpty(this.financialData)) {
                    this.financialKeys = Object.keys(this.financialData);
                }

                if (!ObjectUtil.isEmpty(this.customerInfo.financial.historicalProjected)) {
                    this.form.patchValue(JSON.parse(this.customerInfo.financial.historicalProjected));
                }
            }
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            changeHistorical: [undefined],
            changeProjection: [undefined],
            remarks: [undefined],
            sensitiveJustification: [undefined]
        });
    }

    upload(event) {
        this.uploadFile = event.target.files[0];
        this.fg.append('file', this.uploadFile);
    }

    submitData() {
        this.spinner = true;
        this.fg.append('sensitive', this.sensitive);
        this.fg.append('customerId', this.customerInfoId);
        this.fg.append('historicalProjected', JSON.stringify(this.form.value));
        if (!this.uploadFile) {
            this.fg.append('file', null);
        }
        this.customerInfoService.uploadFinancialExcel(this.fg).subscribe((res: any) => {
            this.customerInfo = res.detail;
            this.financialData = JSON.parse(this.customerInfo.financial.data);
            this.financialKeys = Object.keys(this.financialData);
            this.toast.show(new Alert(AlertType.SUCCESS, 'Saved Financial Data'));
            this.spinner = false;
            this.customer.emit(res.detail);
            this.modalService.dismissAll();
        }, err => {
            this.spinner = false;
            this.modalService.dismissAll();
            this.toast.show(new Alert(AlertType.ERROR, 'Error While Saving Financial Data'));
        });
    }

}

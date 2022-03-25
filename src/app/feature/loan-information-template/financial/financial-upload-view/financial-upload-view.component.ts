import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-financial-upload-view',
    templateUrl: './financial-upload-view.component.html',
    styleUrls: ['./financial-upload-view.component.scss']
})
export class FinancialUploadViewComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() customerInfoId;
    @Output() customer = new EventEmitter();
    form: FormGroup;
    uploadFile;
    fg = new FormData();
    financialKeys;
    spinner = false;
    financialData;

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
        if (!ObjectUtil.isEmpty(this.customerInfo.financial)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.financial.excelData)) {
                this.financialData = JSON.parse(this.customerInfo.financial.excelData);
                this.financialKeys = Object.keys(this.financialData);
            }
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            upload: [undefined]
        });
    }

    upload(event) {
        this.uploadFile = event.target.files[0];
        this.fg.append('file', this.uploadFile);
        this.fg.append('customerId', this.customerInfoId);
    }

    submitData() {
        this.spinner = true;
        this.customerInfoService.uploadFinancialExcel(this.fg).subscribe((res: any) => {
            this.customerInfo = res.detail;
            this.financialData = JSON.parse(this.customerInfo.financial.excelData);
            this.financialKeys = Object.keys(this.financialData);
            this.toast.show(new Alert(AlertType.SUCCESS, 'Saved Financial Data'));
            this.spinner = false;
            this.customer.emit(res.detail);
            this.modalService.dismissAll();
        }, err => {
            this.spinner = false;
            this.toast.show(new Alert(AlertType.ERROR, 'Error While Saving Financial Data'));
        });
    }

}

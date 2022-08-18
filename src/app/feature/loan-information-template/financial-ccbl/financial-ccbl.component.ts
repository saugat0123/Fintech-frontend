import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ToastService} from '../../../@core/utils';
import {CommonService} from '../../../@core/service/common.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {Editor} from '../../../@core/utils/constants/editor';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {DefaultTable} from '../../loan/model/defaultTable';

@Component({
    selector: 'app-financial-ccbl',
    templateUrl: './financial-ccbl.component.html',
    styleUrls: ['./financial-ccbl.component.scss']
})
export class FinancialCcblComponent implements OnInit {

    constructor(private spinner: NgxSpinnerService,
                private customerInfoService: CustomerInfoService,
                private toastService: ToastService,
                public commonService: CommonService,
                public formBuilder: FormBuilder) {
    }
    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile;
    @Output() eventEmitter = new EventEmitter();
    formData: FormData = new FormData();
    file;
    data;
    ckEditor;
    formGroup: FormGroup;
    restUrl = ApiConfig.URL;

    ngOnInit() {
        this.ckEditor = Editor.CK_CONFIG;
        if (!ObjectUtil.isEmpty(this.customerInfo.financialCcbl)) {
            this.data = JSON.parse(this.customerInfo.financialCcbl);
            this.buildForm(this.data.data);
        } else {
            this.buildForm();
        }
    }

    buildForm(data ?: any) {
        this.formGroup = this.formBuilder.group({
            financialHighlight: [data ? data.financialHighlight : undefined],
            financialFigure: [data ? data.financialFigure : DefaultTable.key_Figure()],
            financialFigureComment: [data ? data.financialFigureComment : undefined],
            assesment: [data ? data.assesment : undefined],
            assesment2: [data ? data.assesment2 : undefined],
            assesment3: [data ? data.assesment3 : undefined],
            assessmentComment: [data ? data.assessmentComment : undefined],
            assessmentComment2: [data ? data.assessmentComment2 : undefined],
            assessmentComment3: [data ? data.assessmentComment3 : undefined],
            commentFinancialHighlight: [data ? data.commentFinancialHighlight : undefined],
            justification: [data ? data.justification : undefined],
            justificationComment: [data ? data.justificationComment : undefined]
        });
    }
    upload(event) {
        this.file = event.target.files[0];
    }

    save() {
        if (!ObjectUtil.isEmpty(this.file)) {
            this.formData.append('file', this.file);
            this.formData.append('customerInfoId', this.customerInfo.id.toString());
            this.formData.append('type', 'Financial CCBL');
            this.spinner.show();
            if (!ObjectUtil.isEmpty(this.formData)) {
                this.customerInfoService.saveCcbl(this.formData).subscribe((res: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Financial CCBL'));
                    const data = {
                        file: {
                            docName: 'Financial CCBL',
                            docPath: res.detail
                        },
                        data: this.formGroup.value
                    };
                    this.eventEmitter.emit(JSON.stringify(data));
                    this.spinner.hide();
                }, (error) => {
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Financial CCBL'));
                    this.spinner.hide();
                });
            } else {
                this.spinner.hide();
            }
        } else {
                const data = {
                    file: (!ObjectUtil.isEmpty(this.data) && !ObjectUtil.isEmpty(this.data.file)) ? this.data.file : '',
                    data: this.formGroup.value
                };
            this.eventEmitter.emit(JSON.stringify(data));
        }
    }

}

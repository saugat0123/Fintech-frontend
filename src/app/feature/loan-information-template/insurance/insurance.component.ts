import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Insurance} from '../../admin/modal/insurance';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {InsuranceList} from '../../loan/model/insuranceList';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-insurance',
    templateUrl: './insurance.component.html',
    styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
    @Input() insuranceDataFromModel;
    @Input() fromProfile;
    @Output() insuranceDataEmitter = new EventEmitter();
    @Input() customerInfo;
    form: FormGroup;
    isSubmitted = false;
    insurance: Array<Insurance> = new Array<Insurance>();
    insuranceList: InsuranceList = new InsuranceList();
    insuranceCompanyList = InsuranceList.insuranceCompanyList;
    docTitle = 'Insurance Policy Document';
    docFolderName = 'insuranceDoc';
    assetsInsured = ['Stock', 'Building & Construction', 'Machineries/Equipment', 'Vehicle', 'Other'];

    constructor(
        private formBuilder: FormBuilder,
        private overlay: NgxSpinnerService
    ) {
    }

    get insuranceControls() {
        return this.form.controls;
    }

    ngOnInit() {
        this.buildForm();
        if (ObjectUtil.isEmpty(this.insuranceDataFromModel)) {
            this.addEmptyForm();
        } else {
            if (this.insuranceDataFromModel.length === 0) {
                this.addEmptyForm();
                return;
            }
            this.insuranceDataFromModel.forEach((value) => {
                const formArray = this.form.get('formArray') as FormArray;
                formArray.push(this.addFormData(value));
            });
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({formArray: this.formBuilder.array([])});
    }
    addFormData(data: Insurance) {
        return this.formBuilder.group({id: [ObjectUtil.setUndefinedIfNull(data.id)],
                version: [ObjectUtil.setUndefinedIfNull(data.version)],
                company: [ObjectUtil.setUndefinedIfNull(data.company)],
                insuredAmount: [ObjectUtil.setUndefinedIfNull(data.insuredAmount)],
                premiumAmount: [ObjectUtil.setUndefinedIfNull(data.premiumAmount)],
                issuedDate: [data.issuedDate],
                expiryDate: [data.expiryDate],
                policyType: [ObjectUtil.setUndefinedIfNull(data.policyType)],
                policyNumber: [ObjectUtil.setUndefinedIfNull(data.policyNumber)],
                policyDocumentPath: [ObjectUtil.setUndefinedIfNull(data.policyDocumentPath)],
                remark: [ObjectUtil.setUndefinedIfNull(data.remark)],
                assetInsured: [ObjectUtil.setUndefinedIfNull(data.assetInsured)]});
    }
    addEmptyForm() {
        const formArray = this.form.get('formArray') as FormArray;
        formArray.push(this.addFormData(new Insurance()));
    }
    removeForm(index) {
        const formArray = this.form.get('formArray') as FormArray;
        formArray.removeAt(index);
    }


    submit() {
        this.overlay.show();
        this.isSubmitted = true;
        const formArray = this.form.get('formArray') as FormArray;
        formArray['controls'].forEach((data => {
            const insurance: Insurance = data.value;
            this.insurance.push(insurance);
        }));
        this.insuranceDataEmitter.emit(this.insurance);

    }

    returnIssuedDate(path) {
        return (new Date(path.value));
    }

    documentPath(path, index) {
        this.form.get(['formArray', index, 'policyDocumentPath']).patchValue(path);
    }

}

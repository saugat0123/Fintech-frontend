import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Insurance} from '../../admin/modal/insurance';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {InsuranceList} from '../../loan/model/insuranceList';
import {Editor} from '../../../@core/utils/constants/editor';

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
    ckeConfig;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    get insuranceControls() {
        return this.form.controls;
    }

    ngOnInit() {
        this.configEditor();
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
                company: [ObjectUtil.setUndefinedIfNull(data.company), [Validators.required]],
                insuredAmount: [ObjectUtil.setUndefinedIfNull(data.insuredAmount), [Validators.required]],
                premiumAmount: [ObjectUtil.setUndefinedIfNull(data.premiumAmount), [Validators.required]],
                issuedDate: [data.issuedDate === undefined ? undefined : new Date(data.issuedDate), [Validators.required]],
                expiryDate: [data.expiryDate === undefined ? undefined : new Date(data.expiryDate), [Validators.required]],
                policyType: [ObjectUtil.setUndefinedIfNull(data.policyType)],
                policyNumber: [ObjectUtil.setUndefinedIfNull(data.policyNumber), [Validators.required]],
                policyDocumentPath: [ObjectUtil.setUndefinedIfNull(data.policyDocumentPath)],
                remark: [ObjectUtil.setUndefinedIfNull(data.remark)],
                assetInsured: [ObjectUtil.setUndefinedIfNull(data.assetInsured), [Validators.required]]});
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
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }
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

    configEditor() {
        this.ckeConfig = Editor.config;
    }
}

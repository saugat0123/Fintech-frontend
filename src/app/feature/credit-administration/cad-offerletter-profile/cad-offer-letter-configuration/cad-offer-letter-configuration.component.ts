import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerType} from '../../../customer/model/customerType';
import {DatePipe} from '@angular/common';
import {RelationshipNepali} from '../../../loan/model/relationshipListNepali';
import {Guarantor} from '../../../loan/model/guarantor';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Province} from '../../../admin/modal/province';

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() calendarType: CalendarType;
    @Input() customer: Customer;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    @Output() guarantorDataEmitter = new EventEmitter();

    guarantorList: Array<Guarantor>;
    userConfigForm: FormGroup;
    spinner = false;
    value = [undefined];
    submitted = false;
    relationshipList = RelationshipNepali.enumObject();

    constructor(private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>) {
    }

    get configForm() {
        return this.userConfigForm.controls;
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo.guarantors.guarantorList)) {
            const guarantorList = this.customerInfo.guarantors.guarantorList;
            this.addGuarantor();
            // const guarantorDetails = this.userConfigForm.get('guarantorDetails') as FormArray;
            // guarantorList.forEach(e => {
            //         guarantorDetails.push(
            //             this.formBuilder.group({
            //                 guarantorName: e.name,
            //                 guarantorIssueDate: e.issuedYear,
            //                 guarantorIssueDistrict: e.issuedPlace,
            //                 guarantorAddress: e.district,
            //                 guarantorRelationship: e.relationship,
            //                 guarantorCitizenshipNum: e.citizenNumber
            //             })
            //         );
            //     }
            // );
            this.guarantorList = guarantorList;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
        }
    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            name: [undefined],
            gender: [this.checkIsIndividual() ? this.gender(this.customerInfo.gender) : undefined],
            fatherName: [undefined],
            grandFatherName: [undefined],
            relationMedium: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [this.engToNepNumber.transform(this.customerInfo.idNumber)],
            age: [this.checkIsIndividual() ? this.ageCalculation(this.customer.dob) : undefined],
            permanentProvince: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentMunType: [0],
            temporaryProvince: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipality: [undefined],
            permanentWard: [undefined],
            temporaryWard: [undefined],
            temporaryMunType: [1],
            guarantorDetails: this.formBuilder.array([])
        });
    }

    ageCalculation(startDate) {
        startDate = this.datepipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
        const stDate = new Date(startDate);
        const endDate = new Date();
        let diff = (endDate.getTime() - stDate.getTime()) / 1000;
        diff = diff / (60 * 60 * 24);
        const yr = Math.abs(Math.round(diff / 365.25));
        return this.engToNepNumber.transform(yr.toString());
    }

    gender(val) {
        if (val === 'MALE') {
            return 1;
        } else {
            return 0;
        }
    }

    checkIsIndividual() {
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerInfo.customerType]) {
            return true;
        }
        return false;
    }

    save() {
        this.submitted = true;
        if (this.userConfigForm.invalid) {
            return;
        }
        // this.guarantorDetail.guarantorList = new Array<Guarantor>();
        // const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        // formArray['controls'].forEach(c => {
        //     const guarantor: Guarantor = c.value;
        //     this.guarantorDetail.guarantorList.push(guarantor);
        //     this.guarantorDataEmitter.emit(this.guarantorDetail);
        // });
        this.spinner = true;
        const data = JSON.stringify(this.userConfigForm.value);
        this.customerInfoService.updateNepaliConfigData(data, this.customerInfo.id).subscribe(res => {
            this.customerInfoData = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
            this.spinner = false;
            this.dialogRef.close(this.customerInfoData);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
            console.log(error);
            this.spinner = false;
            this.dialogRef.close();
        });
    }

    closeModal() {
        this.dialogRef.close();
    }

    controlValidation(controlNames, addValidation) {
        controlNames.forEach(s => {
            if (addValidation) {
                this.userConfigForm.get(s).setValidators(Validators.required);
            } else {
                this.userConfigForm.get(s).clearValidators();
            }
            this.userConfigForm.get(s).updateValueAndValidity();
        });
    }

    addGuarantor() {
        (this.userConfigForm.get('guarantorDetails') as FormArray).push(this.addGuarantorField());
    }

    addGuarantorField() {
        return this.formBuilder.group({
            guarantorName : '',
            guarantorIssueDate : '',
            guarantorIssueDistrict : '',
            guarantorAddress : '',
            guarantorRelationship : '',
            guarantorCitizenshipNum : ''
        });
    }

    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
    }
}

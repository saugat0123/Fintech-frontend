import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-birth-mark-letter-nepali',
    templateUrl: './birth-mark-letter-nepali.component.html',
    styleUrls: ['./birth-mark-letter-nepali.component.scss']
})
export class BirthMarkLetterNepaliComponent implements OnInit {
    show = false;
    form: FormGroup;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();

    constructor(
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        const customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
        this.loanFormService.detail(customerId).subscribe((response: any) => {
            this.loanDataHolder = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading loan information.'));
        });
        this.buildForm();
        this.form.valueChanges.subscribe((value) => {
            this.form.patchValue(value, {emitEvent: false});
        });
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            date: [undefined],
            applicantName: [undefined],
            applicantPermanentAddress: [undefined],
            applicantPresentAddress: [undefined],
            applicantAge: [undefined],
            applicantCitizenshipNumber: [undefined],
            applicantCitizenshipIssuedPlace: [undefined],
            applicantCitizenshipIssuedDate: [undefined],
            applicantMobileNumber: [undefined],
            loanType: [undefined],
            applicantRelativeOne: [undefined],
            applicantRelativeOneRelation: [undefined],
            applicantRelativeTwo: [undefined],
            applicantRelativeTwoRelation: [undefined],
            totalApplicantCount: [undefined],
            amountLimit: [undefined],
            amountLimitWord: [undefined],
            interestRate: [undefined],
            interestAmount: [undefined],
            interestWord: [undefined],
            securityGuarantorFirst: this.formBuilder.group({
                name: [undefined],
                district: [undefined],
                address: [undefined],
                stockQuantity: [undefined],
                landArea: [undefined]
            }),
            securityGuarantorRemaining: this.formBuilder.array([this.securityGuarantorRemainingFormGroup()]),
            securityRemaining: this.formBuilder.group({
                securityRemaining1Amount: [undefined],
                securityRemaining1Word: [undefined],
                securityRemaining2Amount: [undefined],
                securityRemaining2Word: [undefined],
                securityRemaining3Amount: [undefined],
                securityRemaining3Word: [undefined]
            })
        });
    }

    securityGuarantorRemainingFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            amount: [undefined],
            amountInWords: [undefined]
        });
    }

    addGuarantor(): void {
        (this.form.get('securityGuarantorRemaining') as FormArray).push(this.securityGuarantorRemainingFormGroup());
    }

    removeGuarantor(deleteIndex: number): void {
        (this.form.get('securityGuarantorRemaining') as FormArray).removeAt(deleteIndex);
    }

}

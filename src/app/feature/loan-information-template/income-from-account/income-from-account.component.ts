import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-income-from-account',
    templateUrl: './income-from-account.component.html',
    styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
    @Input() incomeFromAccountDataResponse: IncomeFromAccount;
    @Input() fromProfile;
    @Output() incomeFromAccountDataEmitter = new EventEmitter();
    @Input() customerInfo: CustomerInfoData;
    incomeDataObject = new IncomeFromAccount();
    incomeFormGroup: FormGroup;
    submitted = false;
    dataForEdit;
    isNewCustomer = false;
    pattern = Pattern;
    repaymentTrack = RepaymentTrackCurrentBank.enumObject();

    disabledLambda = environment.disableCrgLambda;
    disabledAlpha = environment.disableCrgAlpha;

    constructor(private formBuilder: FormBuilder,
                private el: ElementRef,
                private overlay: NgxSpinnerService
    ) {
    }

    get formControls() {
        return this.incomeFormGroup.controls;
    }


    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
            this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
            console.log('dataForEdit', this.dataForEdit);
            this.incomeFormGroup.patchValue(this.dataForEdit);
            if (ObjectUtil.isEmpty(this.dataForEdit.groupProfitability)) {
                this.setOldGroupData(this.dataForEdit);
            } else if (!ObjectUtil.isEmpty(this.dataForEdit.groupProfitability)) {
                this.setGroupProfitabilityData(this.dataForEdit.groupProfitability);
            } else {
                this.addGroupProfitability();
            }
        } else {
            this.addGroupProfitability();
        }
    }

    buildForm() {
        this.incomeFormGroup = this.formBuilder.group({
            interestDuringReview: [undefined,
                [Validators.required]],
            interestAfterNextReview: [undefined,
                [Validators.required]],
            commissionDuringReview: [undefined],
            commissionAfterNextReview: [undefined],
            otherChargesDuringReview: [undefined],
            otherChargesAfterNextReview: [undefined],
            incomeFromTheAccount: [undefined],
            totalIncomeAfterNextReview: [undefined,
                [Validators.required]],
            totalIncomeDuringReview: [undefined,
                [Validators.required]],
            accountNo: [undefined],
            loanProcessingDuringReview: undefined,
            loanProcessingAfterNextReview: undefined,
            lcCommissionDuringReview: undefined,
            lcCommissionAfterNextReview: undefined,
            guaranteeCommissionDuringReview: undefined,
            guaranteeCommissionAfterNextReview: undefined,
            administrationFeeDuring: undefined,
            administrationFeeAfterNext: undefined,
            accountName: undefined,
            accountNoGroup: [undefined],
            accountNameGroup: [undefined],
            groupProfitability: this.formBuilder.array([]),
            grandTotalDuring: 0,
            grandTotalProjected: 0,
        });
    }

    calculateTotalIncomeDuringReview() {
        let totalIncomeDuringReview = 0;
        totalIncomeDuringReview =
            (this.incomeFormGroup.get('administrationFeeDuring').value +
                this.incomeFormGroup.get('interestDuringReview').value +
                this.incomeFormGroup.get('commissionDuringReview').value +
                this.incomeFormGroup.get('otherChargesDuringReview').value +
                this.incomeFormGroup.get('loanProcessingDuringReview').value +
                this.incomeFormGroup.get('lcCommissionDuringReview').value +
                this.incomeFormGroup.get('guaranteeCommissionDuringReview').value).toFixed(8);
        this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
        this.calculateGrandTotal();
    }

    calculateTotalIncomeAfterReview() {
        let totalIncomeAfterNextReview = 0;
        totalIncomeAfterNextReview =
            (this.incomeFormGroup.get('administrationFeeAfterNext').value +
                this.incomeFormGroup.get('interestAfterNextReview').value +
                this.incomeFormGroup.get('commissionAfterNextReview').value +
                this.incomeFormGroup.get('otherChargesAfterNextReview').value +
                this.incomeFormGroup.get('loanProcessingAfterNextReview').value +
                this.incomeFormGroup.get('lcCommissionAfterNextReview').value +
                this.incomeFormGroup.get('guaranteeCommissionAfterNextReview').value).toFixed(8);
        this.incomeFormGroup.get('totalIncomeAfterNextReview').setValue(totalIncomeAfterNextReview);
        this.calculateGrandTotal();
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }


    submitForm() {
        this.overlay.show();
        this.submitted = true;
        if (this.incomeFormGroup.invalid) {
            this.scrollToFirstInvalidControl();
            this.overlay.hide();
            return;
        }
        if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
            this.incomeDataObject = this.incomeFromAccountDataResponse;
        }
        this.incomeDataObject.data = JSON.stringify(this.incomeFormGroup.value);
        this.incomeFromAccountDataEmitter.emit(this.incomeDataObject);
    }

    calculateTotalIncomeDuringReviewGroup(i: number) {
        let totalIncomeDuringReviewGroup = 0;
        totalIncomeDuringReviewGroup =
            (this.incomeFormGroup.get(['groupProfitability', i, 'administrationFeeDuringGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'interestDuringReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'commissionDuringReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'otherChargesDuringReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'loanProcessingDuringReviewGroup']).value).toFixed(8);
        this.incomeFormGroup.get(['groupProfitability', i, 'totalIncomeDuringReviewGroup']).setValue(totalIncomeDuringReviewGroup);
        this.calculateGrandTotal();
    }

    calculateTotalIncomeAfterReviewGroup(i: number) {
        let totalIncomeAfterNextReviewGroup = 0;
        totalIncomeAfterNextReviewGroup =
            (this.incomeFormGroup.get(['groupProfitability', i, 'administrationFeeAfterNextGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'interestAfterNextReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'commissionAfterNextReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'otherChargesAfterNextReviewGroup']).value +
                this.incomeFormGroup.get(['groupProfitability', i, 'loanProcessingAfterNextReviewGroup']).value).toFixed(8);
        this.incomeFormGroup.get(['groupProfitability', i, 'totalIncomeAfterNextReviewGroup']).setValue(totalIncomeAfterNextReviewGroup);
        this.calculateGrandTotal();
    }

    addGroupProfitability() {
        (this.incomeFormGroup.get('groupProfitability') as FormArray).push(
            this.formBuilder.group({
                interestDuringReviewGroup: [undefined],
                interestAfterNextReviewGroup: [undefined],
                commissionDuringReviewGroup: [undefined],
                commissionAfterNextReviewGroup: [undefined],
                loanProcessingDuringReviewGroup: [undefined],
                loanProcessingAfterNextReviewGroup: [undefined],
                otherChargesDuringReviewGroup: [undefined],
                otherChargesAfterNextReviewGroup: [undefined],
                totalIncomeDuringReviewGroup: [undefined],
                totalIncomeAfterNextReviewGroup: [undefined],
                administrationFeeDuringGroup: [undefined],
                administrationFeeAfterNextGroup: [undefined],
            })
        );
        console.log('data', this.incomeFormGroup.get('groupProfitability') as FormArray);
    }

    setOldGroupData(data) {
        const groupData = this.incomeFormGroup.get('groupProfitability') as FormArray;
        groupData.push(
            this.formBuilder.group({
                interestDuringReviewGroup: [data.interestDuringReviewGroup],
                interestAfterNextReviewGroup: [data.interestAfterNextReviewGroup],
                commissionDuringReviewGroup: [data.commissionDuringReviewGroup],
                commissionAfterNextReviewGroup: [data.commissionAfterNextReviewGroup],
                loanProcessingDuringReviewGroup: [data.loanProcessingDuringReviewGroup],
                loanProcessingAfterNextReviewGroup: [data.loanProcessingAfterNextReviewGroup],
                otherChargesDuringReviewGroup: [data.otherChargesDuringReviewGroup],
                otherChargesAfterNextReviewGroup: [data.otherChargesAfterNextReviewGroup],
                totalIncomeDuringReviewGroup: [data.totalIncomeDuringReviewGroup],
                totalIncomeAfterNextReviewGroup: [data.totalIncomeAfterNextReviewGroup],
                administrationFeeDuringGroup: [data.administrationFeeDuringGroup],
                administrationFeeAfterNextGroup: [data.administrationFeeAfterNextGroup],
            })
        );
        console.log('groupData', groupData);
    }

    setGroupProfitabilityData(data) {
        const groupData = this.incomeFormGroup.get('groupProfitability') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                groupData.push(
                    this.formBuilder.group({
                        interestDuringReviewGroup: [d.interestDuringReviewGroup],
                        interestAfterNextReviewGroup: [d.interestAfterNextReviewGroup],
                        commissionDuringReviewGroup: [d.commissionDuringReviewGroup],
                        commissionAfterNextReviewGroup: [d.commissionAfterNextReviewGroup],
                        loanProcessingDuringReviewGroup: [d.loanProcessingDuringReviewGroup],
                        loanProcessingAfterNextReviewGroup: [d.loanProcessingAfterNextReviewGroup],
                        otherChargesDuringReviewGroup: [d.otherChargesDuringReviewGroup],
                        otherChargesAfterNextReviewGroup: [d.otherChargesAfterNextReviewGroup],
                        totalIncomeDuringReviewGroup: [d.totalIncomeDuringReviewGroup],
                        totalIncomeAfterNextReviewGroup: [d.totalIncomeAfterNextReviewGroup],
                        administrationFeeDuringGroup: [d.administrationFeeDuringGroup],
                        administrationFeeAfterNextGroup: [d.administrationFeeAfterNextGroup],
                    })
                );
            });
        }
    }

    calculateGrandTotal() {
        let totalDuring = 0;
        let totalProjected = 0;
        const groupData = this.incomeFormGroup.get('groupProfitability') as FormArray;
        groupData.value.forEach(gd => {
            totalDuring += Number(gd.totalIncomeDuringReviewGroup);
            totalProjected += Number(gd.totalIncomeAfterNextReviewGroup);
        });
        const grandDuring = totalDuring + Number(this.incomeFormGroup.get('totalIncomeDuringReview').value);
        const grandProjected = totalProjected + Number(this.incomeFormGroup.get('totalIncomeAfterNextReview').value);
        this.incomeFormGroup.get('grandTotalDuring').patchValue(grandDuring);
        this.incomeFormGroup.get('grandTotalProjected').patchValue(grandProjected);
    }

    removeGroupProfitability(i: number) {
        (this.incomeFormGroup.get('groupProfitability') as FormArray).removeAt(i);
        this.calculateTotalIncomeDuringReviewGroup(i);
        this.calculateTotalIncomeAfterReviewGroup(i);
    }
}

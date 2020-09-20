import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {MinimumAmountValidator} from '../../../@core/validator/minimum-amount-validator';
import {BaseInterestService} from '../../admin/service/base-interest.service';

@Component({
    selector: 'app-proposal',
    templateUrl: './proposal.component.html',
    styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

    submitted = false;

    @Input() formValue: Proposal;
    @Input() loanIds;
    proposalForm: FormGroup;
    proposalData: Proposal = new Proposal();
    formDataForEdit: Object;
    minimumAmountLimit = 0;
    interestLimit: number;
    allId: Params;
    loanId: number;
    solChecked = false;
    waiverChecked = false;
    riskChecked = false;
    checkedDataEdit;

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastService,
                private baseInterestService: BaseInterestService,
                private el: ElementRef) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.formDataForEdit = JSON.parse(this.formValue.data);
            this.checkedDataEdit = JSON.parse(this.formValue.checkedData);
            this.proposalForm.patchValue(this.formDataForEdit);
            this.setCheckedData(this.checkedDataEdit);
            this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
        } else {
            this.setActiveBaseRate();
        }
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null,
                    loanCategory: null
                };
                this.allId = paramsValue;
                this.loanId = this.allId.loanId ? this.allId.loanId : this.loanIds;
                this.loanConfigService.detail(this.loanId).subscribe((response: any) => {
                    this.minimumAmountLimit = response.detail.minimumProposedAmount;
                    this.proposalForm.get('proposedLimit').setValidators([Validators.required,
                        MinimumAmountValidator.minimumAmountValidator(this.minimumAmountLimit)]);
                    this.proposalForm.get('proposedLimit').updateValueAndValidity();
                    this.interestLimit = response.detail.interestRate;
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
                });
            });
            this.proposalForm.get('interestRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(value) - Number(this.proposalForm.get('baseRate').value)).toFixed(2)));
            this.proposalForm.get('baseRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(this.proposalForm.get('interestRate').value) - Number(value)).toFixed(2)));
    }

    buildForm() {
        this.proposalForm = this.formBuilder.group({

            // Proposed Limit--
            proposedLimit: [undefined, [Validators.required, Validators.min(0)]],

            interestRate: [undefined, [Validators.required, Validators.min(0)]],
            baseRate: [undefined, [Validators.required, Validators.min(0)]],
            premiumRateOnBaseRate: [undefined, [Validators.required, Validators.min(0)]],
            serviceChargeMethod: [undefined, [Validators.required]],
            serviceCharge: [undefined, [Validators.required, Validators.min(0)]],
            tenureDurationInMonths: [undefined, [Validators.required, Validators.min(0)]],
            cibCharge: [undefined, [Validators.required, Validators.min(0)]],
            repaymentMode: [undefined, [Validators.required]],
            purposeOfSubmission: [undefined, [Validators.required]],
            disbursementCriteria: [undefined, [Validators.required]],
            creditInformationReportStatus: [undefined, [Validators.required]],
            incomeFromTheAccount: [undefined, [Validators.required]],
            borrowerInformation: [undefined, [Validators.required]],

            // Additional Fields--
            // for installment Amount--
            installmentAmount: [undefined, Validators.required],
            // for moratoriumPeriod Amount--
            moratoriumPeriod: [undefined],
            // for prepaymentCharge Amount--
            prepaymentCharge: [undefined],
            // for prepaymentCharge Amount--
            purposeOfSubmissionSummary: [undefined, Validators.required],
            // for commitmentFee Amount--
            commitmentFee: [undefined, Validators.required],
            solConclusionRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],


        });
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

    onSubmit() {
        // Proposal Form Data--
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.proposalData = this.formValue;
        }
        this.proposalData.data = JSON.stringify(this.proposalForm.value);

        const mergeChecked = {
            solChecked: this.solChecked,
            waiverChecked: this.waiverChecked,
            riskChecked: this.riskChecked
        };
        this.proposalData.checkedData = JSON.stringify(mergeChecked);

        // Proposed Limit value--
        this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;

        this.proposalData.tenureDurationInMonths = this.proposalForm.get('tenureDurationInMonths').value;
    }

    get formControls() {
        return this.proposalForm.controls;
    }

    setActiveBaseRate() {
   this.baseInterestService.getActiveBaseRate().subscribe(value => {
       this.proposalForm.get('baseRate').setValue(value.detail.rate);
   });
    }

    checkChecked(event, type) {
        switch (type) {
            case 'sol': if (event) {
                this.solChecked = true;
            } else {
                this.solChecked = false;
                this.proposalForm.get('solConclusionRecommendation').setValue(null);
            }
            break;
            case 'waiver': if (event) {
                this.waiverChecked = true;
            } else {
                this.waiverChecked = false;
                this.proposalForm.get('waiverConclusionRecommendation').setValue(null);
            }
            break;
            case 'risk': if (event) {
                this.riskChecked = true;
            } else {
                this.riskChecked = false;
                this.proposalForm.get('riskConclusionRecommendation').setValue(null);

            }
            break;
        }
    }

    setCheckedData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.checkChecked(data['solChecked'], 'sol');
            this.checkChecked(data['waiverChecked'], 'waiver');
            this.checkChecked(data['riskChecked'], 'risk');
        }
    }
}

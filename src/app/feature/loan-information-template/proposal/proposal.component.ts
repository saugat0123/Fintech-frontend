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
import {Editor} from '../../../@core/utils/constants/editor';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  submitted = false;

  @Input() formValue: Proposal;
  @Input() loanIds;
  @Input() loanType;
  proposalForm: FormGroup;
  proposalData: Proposal = new Proposal();
  formDataForEdit: Object;
  minimumAmountLimit = 0;
  collateralRequirement;
  interestLimit: number;
  allId: Params;
  loanId: number;
  solChecked = false;
  waiverChecked = false;
  riskChecked = false;
  checkedDataEdit;
  ckeConfig;
  checkApproved = false;

  constructor(private formBuilder: FormBuilder,
              private loanConfigService: LoanConfigService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private baseInterestService: BaseInterestService,
              private el: ElementRef) {
  }

  ngOnInit() {
    this.configEditor();
    this.buildForm();
    this.checkLoanTypeAndBuildForm();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.formDataForEdit = JSON.parse(this.formValue.data);
      this.checkedDataEdit = JSON.parse(this.formValue.checkedData);
      this.proposalForm.patchValue(this.formDataForEdit);
      this.setCheckedData(this.checkedDataEdit);
      this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
      this.proposalForm.get('existingLimit').patchValue(this.formValue.existingLimit);
      this.proposalForm.get('outStandingLimit').patchValue(this.formValue.outStandingLimit);

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
            this.collateralRequirement = response.detail.collateralRequirement;
            this.proposalForm.get('proposedLimit').setValidators([Validators.required,
              MinimumAmountValidator.minimumAmountValidator(this.minimumAmountLimit)]);
            this.proposalForm.get('proposedLimit').updateValueAndValidity();
            this.interestLimit = response.detail.interestRate;
            this.setCollateralRequirement(this.collateralRequirement);
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
      repaymentMode: [undefined, [Validators.required]],
      disbursementCriteria: [undefined, [Validators.required]],
      repayment: [undefined, Validators.required],
      borrowerInformation: [undefined, [Validators.required]],
      interestAmount: [undefined],
      existingLimit: [undefined],
      outStandingLimit: [undefined],
      collateralRequirement: [undefined, Validators.required],

      // Additional Fields--
      // for installment Amount--
      installmentAmount: [undefined],
      // for moratoriumPeriod Amount--
      moratoriumPeriod: [undefined],
      // for prepaymentCharge Amount--
      prepaymentCharge: ['As Per Standard Charge'],
      // for prepaymentCharge Amount--
      // for commitmentFee Amount--
      commitmentFee: [undefined, Validators.required],
      solConclusionRecommendation: [undefined],
      waiverConclusionRecommendation: [undefined],
      riskConclusionRecommendation: [undefined],


    });
  }

  checkLoanTypeAndBuildForm() {
    if (this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' || this.loanType === 'PARTIAL_SETTLEMENT_LOAN'
        || this.loanType === 'FULL_SETTLEMENT_LOAN') {
      this.checkApproved = true;
      this.proposalForm.get('existingLimit').setValidators(Validators.required);
      this.proposalForm.get('outStandingLimit').setValidators(Validators.required);
    }
}
  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
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
    this.proposalData.existingLimit = this.proposalForm.get('existingLimit').value;
    this.proposalData.outStandingLimit = this.proposalForm.get('outStandingLimit').value;
    this.proposalData.collateralRequirement = this.proposalForm.get('collateralRequirement').value;

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
      case 'sol':
        if (event) {
          this.solChecked = true;
        } else {
          this.solChecked = false;
          this.proposalForm.get('solConclusionRecommendation').setValue(null);
        }
        break;
      case 'waiver':
        if (event) {
          this.waiverChecked = true;
        } else {
          this.waiverChecked = false;
          this.proposalForm.get('waiverConclusionRecommendation').setValue(null);
        }
        break;
      case 'risk':
        if (event) {
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

  checkRepaymentMode() {
    if (this.proposalForm.get('repaymentMode').value === 'EMI' || this.proposalForm.get('repaymentMode').value === 'EQI') {
      this.proposalForm.get('interestAmount').patchValue(0);
      if (this.proposalForm.get('repaymentMode').value === 'EMI') {
        this.calculateEmiEqiAmount('emi');
      } else if (this.proposalForm.get('repaymentMode').value === 'EQI') {
        this.calculateEmiEqiAmount('eqi');
      }
    } else {
      this.proposalForm.get('installmentAmount').patchValue(0);
    }
  }

  calculateEmiEqiAmount(repaymentMode) {
    const proposedAmount = this.proposalForm.get('proposedLimit').value;
    const rate = Number(this.proposalForm.get('interestRate').value) / (12 * 100);
    const n = this.proposalForm.get('tenureDurationInMonths').value;
    if (proposedAmount && rate && n) {
      const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
      if (repaymentMode === 'emi') {
        this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(2)));
      } else if (repaymentMode === 'eqi') {
        this.proposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(2)));
      }
    } else {
      this.proposalForm.get('installmentAmount').patchValue(undefined);
    }
  }

  setCollateralRequirement(collateralRequirement) {
    if (ObjectUtil.isEmpty(this.proposalForm.get('collateralRequirement').value)) {
      this.proposalForm.get('collateralRequirement').patchValue(collateralRequirement);
    }
  }
}

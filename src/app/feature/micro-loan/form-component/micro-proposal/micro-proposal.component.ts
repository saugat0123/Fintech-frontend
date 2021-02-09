import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../admin/modal/proposal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanType} from '../../../loan/model/loanType';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {BaseInterestService} from '../../../admin/service/base-interest.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {MinimumAmountValidator} from '../../../../@core/validator/minimum-amount-validator';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Editor} from '../../../../@core/utils/constants/editor';
import {NumberUtils} from '../../../../@core/utils/number-utils';

@Component({
  selector: 'app-micro-proposal',
  templateUrl: './micro-proposal.component.html',
  styleUrls: ['./micro-proposal.component.scss']
})
export class MicroProposalComponent implements OnInit {

  submitted = false;

  @Input() formValue: Proposal;
  @Input() loanIds;
  @Input() loanType;
  microProposalForm: FormGroup;
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
  absoluteSelected = false;
  customSelected = false;
  isFundable = false;
  fundableNonFundableSelcted = false;
  isFixedDeposit = false;
  loanNature;
  loanNatureSelected = false;
  isRevolving = false;
  isTerminating = false;
  isGeneral = false;
  isVehicle = false;
  isShare = false;
  loanEnumType = LoanType;
  showInstallmentAmount = false;
  showRepaymentMode = false;
  optionList = ['Yes', 'No'];

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
      this.microProposalForm.patchValue(this.formDataForEdit);
      this.setCheckedData(this.checkedDataEdit);
      this.microProposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
      this.microProposalForm.get('existingLimit').patchValue(this.formValue.proposedLimit);
      this.microProposalForm.get('dateOfExpiry').patchValue(!ObjectUtil.isEmpty(this.formValue.dateOfExpiry)
          ? new Date(this.formValue.dateOfExpiry) : undefined);
      this.checkLimitExpiryBuildValidation(this.formValue.limitExpiryMethod);
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
            this.isFundable = response.detail.isFundable;
            this.fundableNonFundableSelcted = !ObjectUtil.isEmpty(response.detail.isFundable);
            this.isFixedDeposit = response.detail.loanTag === 'FIXED_DEPOSIT';
            this.isGeneral = response.detail.loanTag === 'GENERAL';
            this.isShare = response.detail.loanTag === 'SHARE_SECURITY';
            this.isVehicle = response.detail.loanTag === 'VEHICLE';
            this.loanNature = response.detail.loanNature;
            if (!ObjectUtil.isEmpty(this.loanNature)) {
              this.loanNatureSelected = true;
              this.isTerminating = this.loanNature === 'Terminating';
              this.isRevolving = this.loanNature === 'Revolving';
              if (this.isRevolving) {
                this.isGeneral = false;
              }
            }
            if (!this.isFundable) {
              this.isGeneral = false;
            }
            if ( this.isFixedDeposit) {
              this.loanNatureSelected = false;
              this.fundableNonFundableSelcted = false;
            }
            this.microProposalForm.get('proposedLimit').setValidators([Validators.required,
              MinimumAmountValidator.minimumAmountValidator(this.minimumAmountLimit)]);
            this.microProposalForm.get('proposedLimit').updateValueAndValidity();
            this.interestLimit = response.detail.interestRate;
            this.setCollateralRequirement(this.collateralRequirement);
            // this.checkLoanConfig();
            this.setValidatorForPrepaymentField();
          }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
          });
        });
    this.microProposalForm.get('interestRate').valueChanges.subscribe(value => this.microProposalForm.get('premiumRateOnBaseRate')
        .patchValue((Number(value) - Number(this.microProposalForm.get('baseRate').value)).toFixed(2)));
    this.microProposalForm.get('baseRate').valueChanges.subscribe(value => this.microProposalForm.get('premiumRateOnBaseRate')
        .patchValue((Number(this.microProposalForm.get('interestRate').value) - Number(value)).toFixed(2)));
    this.microProposalForm.get('limitExpiryMethod').valueChanges.subscribe(value => this.checkLimitExpiryBuildValidation(value));
    this.checkInstallmentAmount();
    this.microProposalForm.get('proposedLimit').valueChanges.subscribe(value => this.microProposalForm.get('principalAmount')
        .patchValue(Number(value)));

  }

  buildForm() {
    this.microProposalForm = this.formBuilder.group({

      // Proposed Limit--
      proposedLimit: [undefined, [Validators.required, Validators.min(0)]],

      interestRate: [undefined],
      baseRate: [undefined],
      premiumRateOnBaseRate: [undefined],
      serviceChargeMethod: ['PERCENT'],
      serviceCharge: [undefined],
      tenureDurationInMonths: [undefined],
      repaymentMode: [undefined],
      repaymentModeInterest: [undefined],
      repaymentModePrincipal: [undefined],
      disbursementCriteria: [undefined, [Validators.required]],
      repayment: [undefined],
      borrowerInformation: [undefined, [Validators.required]],
      interestAmount: [undefined],
      existingLimit: [undefined],
      outStandingLimit: [undefined],
      collateralRequirement: [undefined, Validators.required],
      limitExpiryMethod: [undefined, Validators.required],
      duration: [undefined, Validators.required],
      condition: [undefined, Validators.required],
      frequency: [undefined,  Validators.required],
      dateOfExpiry: [undefined,  Validators.required],
      remark: [undefined],
      cashMargin: [undefined],
      commissionPercentage: [undefined],
      commissionFrequency: [undefined],
      couponRate: [undefined],
      premiumOnCouponRate: [undefined],
      tenorOfEachDeal: [undefined],
      cashMarginMethod: ['PERCENT'],




      // Additional Fields--
      // for installment Amount--
      installmentAmount: [undefined],
      principalAmount: [undefined],
      // for moratoriumPeriod Amount--
      moratoriumPeriod: [undefined],
      // for prepaymentCharge Amount--
      prepaymentCharge: [(ObjectUtil.isEmpty(this.proposalData)
          || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? undefined :
          this.proposalData.prepaymentCharge],
      // for prepaymentCharge Amount--
      // for commitmentFee Amount--
      commitmentFee: [undefined],
      solConclusionRecommendation: [undefined],
      waiverConclusionRecommendation: [undefined],
      riskConclusionRecommendation: [undefined],
      summeryRecommendation: undefined,
      purposeOfLoan: undefined,
      termsAndCondition: undefined,

      // micro loan proposal fields
      interestRebate: [undefined, Validators.required],
      securityToBeObtained: [undefined, Validators.required],
      loanProcessingFee: [undefined],
      loanProcessingRemarks: [undefined],
      customerEligibile: [undefined],
      customerEligibileRemarks: [undefined],
      customerTakenConsent: [undefined],
      customerTakenConsentRemarks: [undefined],
      businessSite: [undefined],
      businessSiteRemarks: [undefined],
      customerUnderstand: [undefined],
      customerUnderstandRemarks: [undefined],
      applicantSubmit: [undefined],
      applicantSubmitRemarks: [undefined],
      customerExperience: [undefined],
      customerExperienceRemarks: [undefined],
      checkWhether: [undefined],
      checkWhetherRemarks: [undefined],
      applicant: [undefined],
      applicantRemarks: [undefined],
      undividedFamily: [undefined],
      undividedFamilyRemarks: [undefined],
      providersApplicant: [undefined],
      providersApplicantRemarks: [undefined],

    });
  }

  setValidatorForPrepaymentField () {
    if ((this.loanNatureSelected && this.fundableNonFundableSelcted && this.isFundable && this.isTerminating) || this.isVehicle || this.isShare || this.isGeneral) {
      this.microProposalForm.get('prepaymentCharge').setValidators([ Validators.required, Validators.max(100), Validators.min(0)]);
    } else {
      this.microProposalForm.get('prepaymentCharge').clearValidators();
    }
    this.microProposalForm.get('prepaymentCharge').updateValueAndValidity();
  }

  checkLoanTypeAndBuildForm() {
    if (this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' || this.loanType === 'PARTIAL_SETTLEMENT_LOAN'
        || this.loanType === 'FULL_SETTLEMENT_LOAN') {
      this.checkApproved = true;
      this.microProposalForm.get('existingLimit').setValidators(Validators.required);
      this.microProposalForm.get('outStandingLimit').setValidators(Validators.required);
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
    this.proposalData.data = JSON.stringify(this.microProposalForm.value);

    const mergeChecked = {
      solChecked: this.solChecked,
      waiverChecked: this.waiverChecked,
      riskChecked: this.riskChecked
    };
    this.proposalData.checkedData = JSON.stringify(mergeChecked);

    // Proposed Limit value--
    this.proposalData.proposedLimit = this.microProposalForm.get('proposedLimit').value;
    this.proposalData.existingLimit = this.microProposalForm.get('existingLimit').value;
    this.proposalData.outStandingLimit = this.microProposalForm.get('outStandingLimit').value;
    this.proposalData.collateralRequirement = this.microProposalForm.get('collateralRequirement').value;
    this.proposalData.tenureDurationInMonths = this.microProposalForm.get('tenureDurationInMonths').value;
    this.proposalData.limitExpiryMethod = this.microProposalForm.get('limitExpiryMethod').value;
    this.proposalData.duration = this.microProposalForm.get('duration').value;
    this.proposalData.dateOfExpiry = this.microProposalForm.get('dateOfExpiry').value;
    this.proposalData.frequency = this.microProposalForm.get('frequency').value;
    this.proposalData.condition = this.microProposalForm.get('condition').value;
    this.proposalData.cashMargin = this.microProposalForm.get('cashMargin').value;
    this.proposalData.commissionPercentage = this.microProposalForm.get('commissionPercentage').value;
    this.proposalData.commissionFrequency = this.microProposalForm.get('commissionFrequency').value;
    this.proposalData.couponRate = this.microProposalForm.get('couponRate').value;
    this.proposalData.premiumOnCouponRate = this.microProposalForm.get('premiumOnCouponRate').value;
    this.proposalData.tenorOfEachDeal = this.microProposalForm.get('tenorOfEachDeal').value;
    this.proposalData.cashMarginMethod = this.microProposalForm.get('cashMarginMethod').value;

  }

  get formControls() {
    return this.microProposalForm.controls;
  }

  setActiveBaseRate() {
    this.baseInterestService.getActiveBaseRate().subscribe(value => {
      this.microProposalForm.get('baseRate').setValue(value.detail.rate);
    });
  }

  checkChecked(event, type) {
    switch (type) {
      case 'sol':
        if (event) {
          this.solChecked = true;
        } else {
          this.solChecked = false;
          this.microProposalForm.get('solConclusionRecommendation').setValue(null);
        }
        break;
      case 'waiver':
        if (event) {
          this.waiverChecked = true;
        } else {
          this.waiverChecked = false;
          this.microProposalForm.get('waiverConclusionRecommendation').setValue(null);
        }
        break;
      case 'risk':
        if (event) {
          this.riskChecked = true;
        } else {
          this.riskChecked = false;
          this.microProposalForm.get('riskConclusionRecommendation').setValue(null);

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
    if (this.showInstallmentAmount) {
      this.microProposalForm.get('interestAmount').patchValue(0);
      const repaymentMode = this.microProposalForm.get('repaymentMode').value;
      switch (repaymentMode) {
        case 'EMI':
          this.calculateEmiEqiAmount('emi');
          break;
        case 'EQI':
          this.calculateEmiEqiAmount('eqi');
          break;
      }
    } else {
      this.microProposalForm.get('installmentAmount').patchValue(0);
    }
  }

  checkCustomRepaymentMode() {
    if (this.showRepaymentMode) {
      this.calculateRepaymentModeAmounts(this.microProposalForm.get('repaymentModePrincipal').value , 'PRINCIPAL');
      this.calculateRepaymentModeAmounts(this.microProposalForm.get('repaymentModeInterest').value , 'INTEREST');
    }
  }

  calculateEmiEqiAmount(repaymentMode) {
    const proposedAmount = this.microProposalForm.get('proposedLimit').value;
    const rate = Number(this.microProposalForm.get('interestRate').value) / (12 * 100);
    const n = this.microProposalForm.get('tenureDurationInMonths').value;
    if (proposedAmount && rate && n) {
      const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
      switch (repaymentMode) {
        case 'emi':
          this.microProposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(2)));
          break;
        case 'eqi':
          this.microProposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(2)));
          break;
      }
    } else {
      this.microProposalForm.get('installmentAmount').patchValue(undefined);
    }
  }

  /** @param key - calculate type identifier,
   * @param repaymentMode - period of calculation*/
  calculateRepaymentModeAmounts(repaymentMode, key) {
    let principleAmount = 0;
    let interestAmount = 0;
    const rate = Number(this.microProposalForm.get('interestRate').value) / 100;
    const proposedAmount = this.microProposalForm.get('proposedLimit').value;
    const tenure = this.microProposalForm.get('tenureDurationInMonths').value;
    if (proposedAmount) {
      switch (repaymentMode) {
        case 'MONTHLY':
          interestAmount = (proposedAmount * rate) / 12;
          principleAmount = (proposedAmount / tenure) * 12;
          break;
        case 'QUARTERLY':
          interestAmount = (proposedAmount * rate) / 4;
          principleAmount = (proposedAmount / tenure) * 4;
          break;
        case 'SEMI-ANNUALLY' :
          interestAmount = (proposedAmount * rate) / 2;
          principleAmount = (proposedAmount / tenure) * 2;
          break;
        default:
          principleAmount = 0;
          interestAmount = 0;
      }
      if (key === 'INTEREST') {
        this.microProposalForm.get('interestAmount').patchValue(Number((interestAmount).toFixed(2)));
      }if (key === 'PRINCIPAL') {
        this.microProposalForm.get('principalAmount').patchValue(Number((principleAmount).toFixed(2)));
      }
    }
  }

  setCollateralRequirement(collateralRequirement) {
    if (ObjectUtil.isEmpty(this.microProposalForm.get('collateralRequirement').value)) {
      this.microProposalForm.get('collateralRequirement').patchValue(collateralRequirement);
    }
  }

  checkLimitExpiryBuildValidation(limitExpiry) {
    if (limitExpiry === 'ABSOLUTE') {
      this.absoluteSelected = true;
      this.customSelected = false;
      this.microProposalForm.get('dateOfExpiry').setValidators([Validators.required]);
      this.microProposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.microProposalForm.get('duration').clearValidators();
      this.microProposalForm.get('duration').patchValue(undefined);
      this.microProposalForm.get('duration').updateValueAndValidity();
      this.microProposalForm.get('condition').clearValidators();
      this.microProposalForm.get('condition').updateValueAndValidity();
      this.microProposalForm.get('condition').patchValue(undefined);
      this.microProposalForm.get('frequency').clearValidators();
      this.microProposalForm.get('frequency').updateValueAndValidity();
      this.microProposalForm.get('frequency').patchValue(undefined);
    } else if (limitExpiry === 'CUSTOM') {
      this.customSelected = true;
      this.absoluteSelected = false;
      this.microProposalForm.get('duration').setValidators([Validators.required]);
      this.microProposalForm.get('duration').updateValueAndValidity();
      this.microProposalForm.get('condition').setValidators([Validators.required]);
      this.microProposalForm.get('condition').updateValueAndValidity();
      this.microProposalForm.get('frequency').setValidators([Validators.required]);
      this.microProposalForm.get('frequency').updateValueAndValidity();
      this.microProposalForm.get('dateOfExpiry').clearValidators();
      this.microProposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.microProposalForm.get('dateOfExpiry').patchValue(undefined);

    }
  }

  checkInstallmentAmount() {
    if (this.microProposalForm.get('repaymentMode').value === 'EMI' || this.microProposalForm.get('repaymentMode').value === 'EQI') {
      this.showInstallmentAmount = true;
      this.showRepaymentMode = false;
      this.checkRepaymentMode();
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , false);
    } else if (this.microProposalForm.get('repaymentMode').value === 'CUSTOM') {
      this.showRepaymentMode = true;
      this.showInstallmentAmount = false;
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , true);
    } else {
      this.showInstallmentAmount = false;
      this.showRepaymentMode = false;
    }
  }

  controlValidation(controlNames, addValidation) {
    controlNames.forEach(s => {
      if (addValidation) {
        this.microProposalForm.get(s).setValidators(Validators.required);
      } else {
        this.microProposalForm.get(s).clearValidators();
      }
      this.microProposalForm.get(s).updateValueAndValidity();
    });
  }

  calculateLimitValues() {

    switch (this.loanType) {
      case  'PARTIAL_SETTLEMENT_LOAN':
        const newLimit = this.formControls.existingLimit.value - this.formControls.outStandingLimit.value;
        this.formControls.proposedLimit.setValue(NumberUtils.isNumber(newLimit));
        return;
      case  'ENHANCED_LOAN':
        const enhanceLimit = this.formControls.existingLimit.value + this.formControls.outStandingLimit.value;
        this.formControls.proposedLimit.setValue(NumberUtils.isNumber(enhanceLimit));
        return;
      default:
        return;
    }

  }

  calculateInterestAmountForRepaymentMode() {
    const proposeLimit = Number(this.microProposalForm.get('proposedLimit').value);
    const interestRate = Number(this.microProposalForm.get('interestRate').value);
    const tenureDurationInMonths = Number(this.microProposalForm.get('tenureDurationInMonths').value);
    const interestAmount = (proposeLimit * (interestRate / 100) * tenureDurationInMonths) / 12;
    return this.microProposalForm.get('interestAmount').setValue(Number(interestAmount).toFixed(2));
  }

}

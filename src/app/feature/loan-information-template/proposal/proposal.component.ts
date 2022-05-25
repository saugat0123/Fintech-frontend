import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {MinimumAmountValidator} from '../../../@core/validator/minimum-amount-validator';
import {BaseInterestService} from '../../admin/service/base-interest.service';
import {Editor} from '../../../@core/utils/constants/editor';
import {LoanType} from '../../loan/model/loanType';
import {NumberUtils} from '../../../@core/utils/number-utils';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';

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
  swapChargeChecked = false;
  subsidizedLoanChecked = false;
  client = environment.client;
  clientName = Clients;
  othersSubsidyLoan = false;
  existInterestLimit: number;
  showInterestAmount = true;

  subsidyLoanType = [
    {value: 'Literate Youth Self Employment Loan'},
    {value: 'Project Loan For Youth Returning From Foreign'},
    {value: 'Female Entrepreneur Loan'},
    {value: 'Business Loan For Marginalized Group of People'},
    {value: 'Loan For Higher Technical Know How'},
    {value: 'Residential Home Loan For Earthquake Affected'},
    {value: 'Loan For Garment Industry Operation'},
    {value: 'Loan For Training From Approved Technical Know How'},
    {value: 'Agriculture Business Loan (Overdraft)'},
    {value: 'Agriculture Business Loan (Term)'},
    {value: 'Others'},
  ];
  groupExposureData;
  isAllExposureFieldNull = false;

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
      if (this.proposalForm.get('subsidyLoanType').value === 'Others') {
        this.othersSubsidyLoan = true;
      }
      if (ObjectUtil.isEmpty(this.formDataForEdit['settlementAmount']) && this.loanType === 'FULL_SETTLEMENT_LOAN'
          || this.loanType === 'CLOSURE_LOAN') {
        this.proposalForm.get('settlementAmount').patchValue(this.formValue.existingLimit);
      }
      this.setCheckedData(this.checkedDataEdit);
      this.proposalForm.get('proposedLimit').patchValue(this.formValue.proposedLimit);
      this.interestLimit = this.formDataForEdit['interestRate'];
      /*this.proposalForm.get('existingLimit').patchValue(this.formValue.proposedLimit);*/
      this.proposalForm.get('dateOfExpiry').patchValue(!ObjectUtil.isEmpty(this.formValue.dateOfExpiry)
          ? new Date(this.formValue.dateOfExpiry) : undefined);
      this.checkLimitExpiryBuildValidation(this.formValue.limitExpiryMethod);
      this.existInterestLimit = this.formDataForEdit['existInterestRate'];
      if (!ObjectUtil.isEmpty(this.formValue.groupExposure)) {
        this.groupExposureData = JSON.parse(this.formValue.groupExposure);
        this.setGroupExposureData(this.groupExposureData);
      }
    } else {
      this.setActiveBaseRate();
      this.addGroupExposureData();
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
            if (this.isFixedDeposit) {
              this.loanNatureSelected = false;
              this.fundableNonFundableSelcted = false;
            }
            this.proposalForm.get('proposedLimit').setValidators([Validators.required,
              MinimumAmountValidator.minimumAmountValidator(this.minimumAmountLimit)]);
            this.proposalForm.get('proposedLimit').updateValueAndValidity();
            this.clearProposedLimitValidation();
            if (ObjectUtil.isEmpty(this.formDataForEdit)) {
              this.interestLimit = response.detail.interestRate;
            }
            this.setCollateralRequirement(this.collateralRequirement);
            // this.checkLoanConfig();
            this.setValidatorForPrepaymentField();
            if (ObjectUtil.isEmpty(this.formDataForEdit)) {
              this.existInterestLimit = response.detail.existInterestRate;
            }
          }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
          });
        });
    this.proposalForm.get('interestRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
    .patchValue((Number(value) - Number(this.proposalForm.get('baseRate').value)).toFixed(2)));
    this.proposalForm.get('baseRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
    .patchValue((Number(this.proposalForm.get('interestRate').value) - Number(value)).toFixed(2)));
    this.proposalForm.get('limitExpiryMethod').valueChanges.subscribe(value => this.checkLimitExpiryBuildValidation(value));
    this.checkInstallmentAmount();
    // this.proposalForm.get('proposedLimit').valueChanges.subscribe(value => this.proposalForm.get('principalAmount')
    //     .patchValue(Number(value)));
  }

  buildForm() {
    this.proposalForm = this.formBuilder.group({

      // Proposed Limit--
      proposedLimit: [undefined, [Validators.required, Validators.min(0)]],

      interestRate: [undefined],
      baseRate: [undefined],
      premiumRateOnBaseRate: [undefined],
      serviceChargeMethod: ['PERCENT'],
      swapChargeMethod: ['PERCENT'],
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
      swapCharge: [undefined],
      subsidizedLoan: [undefined],
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
      enhanceLimitAmount: [undefined],
      subsidyLoanType: [undefined],
      subsidyJustification: [undefined],
      others: [undefined],

      // Additional Fields--
      // for installment Amount--
      installmentAmount: [undefined],
      principalAmount: [undefined],
      // for moratoriumPeriod Amount--
      moratoriumPeriod: [undefined],
      // for prepaymentCharge Amount--
      prepaymentCharge: [(ObjectUtil.isEmpty(this.proposalData)
          || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? 0 :
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
      prepaymentSwapCommitment: [undefined],
      existCashMargin: [undefined],
      existCashMarginMethod: ['PERCENT'],
      existInterestRate: [undefined],
      existCommissionPercentage: [undefined],
      settlementAmount: [undefined],
      groupExposure: this.formBuilder.array([]),
      interestPrincipalRepayment: undefined,
      proposalRemark: [undefined],
      existingServiceCharge: [undefined]
    });
  }

  setValidatorForPrepaymentField () {
    if ((this.client !== this.clientName.SHINE_RESUNGA) && ((this.loanNatureSelected && this.fundableNonFundableSelcted &&
        this.isFundable && this.isTerminating) || this.isVehicle || this.isShare || this.isGeneral)) {
      this.proposalForm.get('prepaymentCharge').setValidators([Validators.required, Validators.max(100), Validators.min(0)]);
    } else {
      this.proposalForm.get('prepaymentCharge').clearValidators();
    }
    this.proposalForm.get('prepaymentCharge').updateValueAndValidity();
  }

  checkLoanTypeAndBuildForm() {
    if (this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' || this.loanType === 'PARTIAL_SETTLEMENT_LOAN'
        || this.loanType === 'FULL_SETTLEMENT_LOAN' || this.loanType === 'RENEW_WITH_ENHANCEMENT' || this.loanType === 'CLOSURE_LOAN') {
      this.checkApproved = true;
      this.proposalForm.get('existingLimit').setValidators(Validators.required);
      this.proposalForm.get('outStandingLimit');
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
    if (this.loanType === LoanType.getEnum(LoanType.FULL_SETTLEMENT_LOAN) || this.loanType === LoanType.getEnum(LoanType.CLOSURE_LOAN)) {
      const fullSettlementAmount = this.formControls.existingLimit.value - this.formControls.settlementAmount.value;
      this.formControls.existingLimit.setValue(NumberUtils.isNumber(fullSettlementAmount));
      console.log('This is the test data :: ', fullSettlementAmount);
    }
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.proposalData = this.formValue;
    }
    this.proposalData.data = JSON.stringify(this.proposalForm.value);

    const mergeChecked = {
      solChecked: this.solChecked,
      waiverChecked: this.waiverChecked,
      riskChecked: this.riskChecked,
      swapChargeChecked: this.swapChargeChecked,
      subsidizedLoanChecked: this.subsidizedLoanChecked
    };
    this.proposalData.checkedData = JSON.stringify(mergeChecked);

    // Proposed Limit value--
    this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;
    this.proposalData.existingLimit = this.proposalForm.get('existingLimit').value;
    this.proposalData.outStandingLimit = this.proposalForm.get('outStandingLimit').value;
    this.proposalData.collateralRequirement = this.proposalForm.get('collateralRequirement').value;
    this.proposalData.tenureDurationInMonths = this.proposalForm.get('tenureDurationInMonths').value;
    this.proposalData.limitExpiryMethod = this.proposalForm.get('limitExpiryMethod').value;
    this.proposalData.duration = this.proposalForm.get('duration').value;
    this.proposalData.dateOfExpiry = this.proposalForm.get('dateOfExpiry').value;
    this.proposalData.frequency = this.proposalForm.get('frequency').value;
    this.proposalData.condition = this.proposalForm.get('condition').value;
    this.proposalData.cashMargin = this.proposalForm.get('cashMargin').value;
    this.proposalData.commissionPercentage = this.proposalForm.get('commissionPercentage').value;
    this.proposalData.commissionFrequency = this.proposalForm.get('commissionFrequency').value;
    this.proposalData.couponRate = this.proposalForm.get('couponRate').value;
    this.proposalData.premiumOnCouponRate = this.proposalForm.get('premiumOnCouponRate').value;
    this.proposalData.tenorOfEachDeal = this.proposalForm.get('tenorOfEachDeal').value;
    this.proposalData.cashMarginMethod = this.proposalForm.get('cashMarginMethod').value;
    this.proposalData.enhanceLimitAmount = this.proposalForm.get('enhanceLimitAmount').value;
    this.proposalData.settlementAmount = this.proposalForm.get('settlementAmount').value;
    this.proposalData.existCashMargin = this.proposalForm.get('existCashMargin').value;
    this.proposalData.existCashMarginMethod = this.proposalForm.get('existCashMarginMethod').value;
    this.proposalData.existCommissionPercentage = this.proposalForm.get('existCommissionPercentage').value;
    this.proposalData.groupExposure = JSON.stringify(this.proposalForm.get('groupExposure').value);
    this.proposalData.proposalRemark = this.proposalForm.get('proposalRemark').value;
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
      case 'swapCharge':
        if (event) {
          this.swapChargeChecked = true;
        } else {
          this.swapChargeChecked = false;
          this.proposalForm.get('swapCharge').setValue(null);
        }
        break;
      case 'subsidizedLoan':
        if (event) {
          this.subsidizedLoanChecked = true;
        } else {
          this.subsidizedLoanChecked = false;
          this.othersSubsidyLoan = false;
          this.proposalForm.get('others').setValue(null);
          this.proposalForm.get('subsidizedLoan').setValue(null);
          this.proposalForm.get('subsidyLoanType').setValue(null);
          this.proposalForm.get('subsidyJustification').setValue(null);
        }
        break;
    }
  }

  setCheckedData(data) {
    if (!ObjectUtil.isEmpty(data)) {
      this.checkChecked(data['solChecked'], 'sol');
      this.checkChecked(data['waiverChecked'], 'waiver');
      this.checkChecked(data['riskChecked'], 'risk');
      this.checkChecked(data['swapChargeChecked'], 'swapCharge');
      this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
    }
  }

  checkRepaymentMode() {
    if (this.showInstallmentAmount) {
      this.proposalForm.get('interestAmount').patchValue(0);
      const repaymentMode = this.proposalForm.get('repaymentMode').value;
      switch (repaymentMode) {
        case 'EMI':
          this.calculateEmiEqiAmount('emi');
          break;
        case 'EQI':
          this.calculateEmiEqiAmount('eqi');
          break;
      }
    } else {
      this.proposalForm.get('installmentAmount').patchValue(0);
    }
  }

  checkCustomRepaymentMode() {
   if (this.showRepaymentMode) {
     this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModePrincipal').value , 'PRINCIPAL');
     this.calculateRepaymentModeAmounts(this.proposalForm.get('repaymentModeInterest').value , 'INTEREST');
   }
  }

  calculateEmiEqiAmount(repaymentMode) {
    const proposedAmount = this.proposalForm.get('proposedLimit').value;
    const rate = Number(this.proposalForm.get('interestRate').value) / (12 * 100);
    const n = this.proposalForm.get('tenureDurationInMonths').value;
    const eqiRate = Number(this.proposalForm.get('interestRate').value) / (4 * 100);
    if (proposedAmount && rate && n) {
      const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
      const eqi = Number((proposedAmount * eqiRate * Math.pow(1 + eqiRate, n / 3)) / Number(Math.pow(1 + eqiRate, n / 3) - 1));
      switch (repaymentMode) {
        case 'emi':
          this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(2)));
          break;
        case 'eqi':
          this.proposalForm.get('installmentAmount').patchValue(Number(eqi.toFixed(2)));
          break;
      }
    } else {
      this.proposalForm.get('installmentAmount').patchValue(undefined);
    }
  }

  /** @param key - calculate type identifier,
   * @param repaymentMode - period of calculation*/
  calculateRepaymentModeAmounts(repaymentMode, key) {
    let principleAmount = 0;
    let interestAmount = 0;
    const rate = Number(this.proposalForm.get('interestRate').value) / 100;
    const proposedAmount = this.proposalForm.get('proposedLimit').value;
    const tenure = this.proposalForm.get('tenureDurationInMonths').value;
    if (proposedAmount) {
      switch (repaymentMode) {
        case 'MONTHLY':
          interestAmount = (proposedAmount * rate) / 12;
          principleAmount = (proposedAmount / tenure);
          break;
        case 'QUARTERLY':
          interestAmount = ((proposedAmount * rate) / 12) * 3;
          principleAmount = (proposedAmount / tenure) * 3;
          break;
        case 'SEMI-ANNUALLY' :
          interestAmount = ((proposedAmount * rate) / 12) * 6;
          principleAmount = (proposedAmount / tenure) * 6;
          break;
        case 'ANNUALLY':
          interestAmount = (proposedAmount * rate);
          principleAmount = (proposedAmount / tenure) * 12;
          break;
        case 'AT MATURITY':
          principleAmount = proposedAmount;
          break;
        default:
          principleAmount = 0;
          interestAmount = 0;
      }
      if (key === 'INTEREST') {
        this.proposalForm.get('interestAmount').patchValue(Number((interestAmount).toFixed(2)));
      }if (key === 'PRINCIPAL') {
        this.proposalForm.get('principalAmount').patchValue(Number((principleAmount).toFixed(2)));
      }
    }
  }

  setCollateralRequirement(collateralRequirement) {
    if (ObjectUtil.isEmpty(this.proposalForm.get('collateralRequirement').value)) {
      this.proposalForm.get('collateralRequirement').patchValue(collateralRequirement);
    }
  }

  checkLimitExpiryBuildValidation(limitExpiry) {
    if (limitExpiry === 'ABSOLUTE') {
      this.absoluteSelected = true;
      this.customSelected = false;
      this.proposalForm.get('dateOfExpiry').setValidators([Validators.required]);
      this.proposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.proposalForm.get('duration').clearValidators();
      this.proposalForm.get('duration').patchValue(undefined);
      this.proposalForm.get('duration').updateValueAndValidity();
      this.proposalForm.get('condition').clearValidators();
      this.proposalForm.get('condition').updateValueAndValidity();
      this.proposalForm.get('condition').patchValue(undefined);
      this.proposalForm.get('frequency').clearValidators();
      this.proposalForm.get('frequency').updateValueAndValidity();
      this.proposalForm.get('frequency').patchValue(undefined);
    } else if (limitExpiry === 'CUSTOM') {
      this.customSelected = true;
      this.absoluteSelected = false;
      this.proposalForm.get('duration').setValidators([Validators.required]);
      this.proposalForm.get('duration').updateValueAndValidity();
      this.proposalForm.get('condition').setValidators([Validators.required]);
      this.proposalForm.get('condition').updateValueAndValidity();
      this.proposalForm.get('frequency').setValidators([Validators.required]);
      this.proposalForm.get('frequency').updateValueAndValidity();
      this.proposalForm.get('dateOfExpiry').clearValidators();
      this.proposalForm.get('dateOfExpiry').updateValueAndValidity();
      this.proposalForm.get('dateOfExpiry').patchValue(undefined);

    }
  }

  checkInstallmentAmount() {
    if (this.proposalForm.get('repaymentMode').value === 'EMI' || this.proposalForm.get('repaymentMode').value === 'EQI') {
      this.showInstallmentAmount = true;
      this.showRepaymentMode = false;
      this.checkRepaymentMode();
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , false);
    } else if (this.proposalForm.get('repaymentMode').value === 'CUSTOM') {
      this.showInterestAmount = false;
      this.showRepaymentMode = true;
      this.showInstallmentAmount = false;
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , true);
    } else {
      this.calculateInterestAmountForRepaymentMode();
      this.showInstallmentAmount = false;
      this.showRepaymentMode = false;
      this.showInterestAmount = true;
    }
  }

  controlValidation(controlNames, addValidation) {
    controlNames.forEach(s => {
      if (addValidation) {
        this.proposalForm.get(s).setValidators(Validators.required);
      } else {
      this.proposalForm.get(s).clearValidators();
      }
      this.proposalForm.get(s).updateValueAndValidity();
    });
  }

  // checkLoanConfig() {
  //   if (this.isFixedDeposit) {
  //     this.proposalForm.get('couponRate').setValidators(Validators.required);
  //     this.proposalForm.get('couponRate').updateValueAndValidity();
  //     this.proposalForm.get('premiumOnCouponRate').setValidators(Validators.required);
  //     this.proposalForm.get('premiumOnCouponRate').updateValueAndValidity();
  //   }
  //   if (!this.isFundable) {
  //     this.proposalForm.get('cashMargin').setValidators(Validators.required);
  //     this.proposalForm.get('cashMargin').updateValueAndValidity();
  //     this.proposalForm.get('commissionPercentage').setValidators(Validators.required);
  //     this.proposalForm.get('commissionPercentage').updateValueAndValidity();
  //     this.proposalForm.get('commissionFrequency').setValidators(Validators.required);
  //     this.proposalForm.get('commissionFrequency').updateValueAndValidity();
  //   }
  // }

    calculateLimitValues() {

        switch (this.loanType) {
          case  'PARTIAL_SETTLEMENT_LOAN':
            const newLimit = this.formControls.existingLimit.value - this.formControls.settlementAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(newLimit));
            return;
          case  'ENHANCED_LOAN':
            const enhancementAmount = this.formControls.existingLimit.value + this.formControls.enhanceLimitAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(enhancementAmount));
            return;
          case  'RENEW_WITH_ENHANCEMENT':
            const enhanceLimit = this.formControls.existingLimit.value + this.formControls.enhanceLimitAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(enhanceLimit));
            return;
          case  'FULL_SETTLEMENT_LOAN':
            const fullSettlementAmount = this.formControls.existingLimit.value - this.formControls.settlementAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(fullSettlementAmount));
            return;
          case  'CLOSURE_LOAN':
            const closedAmount = this.formControls.existingLimit.value - this.formControls.settlementAmount.value;
            this.formControls.proposedLimit.setValue(NumberUtils.isNumber(closedAmount));
            this.clearProposedLimitValidation();
            return;
          default:
            return;
        }

    }

    calculateInterestAmountForRepaymentMode() {
        const proposeLimit = Number(this.proposalForm.get('proposedLimit').value);
        const interestRate = Number(this.proposalForm.get('interestRate').value);
        const tenureDurationInMonths = Number(this.proposalForm.get('tenureDurationInMonths').value) / 12;
        const interestAmount = (proposeLimit * (interestRate / 100) * tenureDurationInMonths) / 12;
        this.proposalForm.get('interestAmount').setValue(Number(interestAmount).toFixed(2));
        this.proposalForm.get('principalAmount').setValue(Number(proposeLimit).toFixed(2));
    }

  calculateInterestRate() {
    const baseRate = Number(this.proposalForm.get('baseRate').value);
    const premiumRateOnBaseRate = Number(this.proposalForm.get('premiumRateOnBaseRate').value);
    const discountRate = Number(this.proposalForm.get('subsidizedLoan').value);

    const interestRate = (baseRate - discountRate + premiumRateOnBaseRate);
    return this.proposalForm.get('interestRate').setValue(Number(interestRate).toFixed(2));
  }

  onChange() {
    const isOtherSelected = this.proposalForm.get('subsidyLoanType').value.includes('Others');
    if (isOtherSelected) {
      this.othersSubsidyLoan = true;
    } else {
      this.othersSubsidyLoan = false;
      this.proposalForm.get('others').setValue(null);
    }
  }

  addGroupExposureData() {
    this.checkGroupExposureNull();
    if (this.isAllExposureFieldNull) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please fill at least one field'));
    } else {
      (this.proposalForm.get('groupExposure') as FormArray).push (
          this.formBuilder.group({
            clientName: [undefined],
            facilityType: [undefined],
            loanLimit: [undefined],
            osLimit: [undefined],
            proposedLimit: [undefined],
            fmvDv: [undefined],
            exposure: [undefined],
            remarks: [undefined],
          })
      );
    }
  }

  clearProposedLimitValidation() {
    if (this.loanType === 'FULL_SETTLEMENT_LOAN' || this.loanType === 'CLOSURE_LOAN') {
      console.log('Im inside the validation ');
      this.proposalForm.get('proposedLimit').clearValidators();
      this.proposalForm.get('proposedLimit').updateValueAndValidity();
    }
  }

  setGroupExposureData(data) {
    const groupExposuresArray = this.proposalForm.get('groupExposure') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        groupExposuresArray.push(this.formBuilder.group({
          clientName: [singleData.clientName],
          facilityType: [singleData.facilityType],
          loanLimit: [singleData.loanLimit],
          osLimit: [singleData.osLimit],
          proposedLimit: [singleData.proposedLimit],
          fmvDv: [singleData.fmvDv],
          exposure: [singleData.exposure],
          remarks: [singleData.remarks],
        }));
      });
    }
  }

  removeGroupExposureData(index: number) {
    (<FormArray>this.proposalForm.get('groupExposure')).removeAt(index);
  }

  checkGroupExposureNull() {
    const groupExposuresArray = this.proposalForm.get('groupExposure') as FormArray;
    groupExposuresArray.controls.forEach((data) => {
      const clientName = data.get('clientName').value;
      const facilityType = data.get('facilityType').value;
      const loanLimit = data.get('loanLimit').value;
      const osLimit = data.get('osLimit').value;
      const proposedLimit = data.get('proposedLimit').value;
      const fmvDv = data.get('fmvDv').value;
      const exposure = data.get('exposure').value;
      if (ObjectUtil.isEmpty(clientName) && ObjectUtil.isEmpty(facilityType) && ObjectUtil.isEmpty(loanLimit) && ObjectUtil.isEmpty(osLimit)
          && ObjectUtil.isEmpty(proposedLimit) && ObjectUtil.isEmpty(fmvDv) && ObjectUtil.isEmpty(exposure)) {
        this.isAllExposureFieldNull = true;
      } else {
        this.isAllExposureFieldNull = false;
      }
    });
  }

}

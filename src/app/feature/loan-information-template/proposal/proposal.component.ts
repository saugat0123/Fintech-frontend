import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import {LoanDataHolder} from '../../loan/model/loanData';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {IncomeFromAccountComponent} from '../income-from-account/income-from-account.component';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CreditRiskGradingGammaComponent} from '../credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {SecurityAdderComponent} from '../../loan-information-view/security-view/security-adder/security-adder.component';

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
    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile;
    @Input() loan: LoanDataHolder;
    @ViewChild('earning', {static: false}) earning: IncomeFromAccountComponent;
    @ViewChild('crgGamma', {static: false}) crgGammaComponent: CreditRiskGradingGammaComponent;
    @ViewChild('securityAdderComponent', {static: false}) securityAdderComponent: SecurityAdderComponent;
    @Output() emitter = new EventEmitter();
    proposedLimit: number;
    proposalForm: FormGroup;
    proposalData: Proposal = new Proposal();
    formDataForEdit: any;
    minimumAmountLimit = 0;
    collateralRequirement;
    interestLimit: number;
    allId: Params;
    loanId: number;
    solChecked = false;
    waiverChecked = false;
    deviationChecked = false;
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
    isHomeLoan = false;
    loanEnumType = LoanType;
    showInstallmentAmount = false;
    showRepaymentMode = false;
    swapChargeChecked = false;
    swapChargeVar = false;
    subsidizedLoanChecked = false;
    othersSubsidyLoan = false;
    existInterestLimit: number;
    showInterestAmount = true;
    legalDocs;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    prepaymentChargeChecked = false;
    purposeChecked = false;
    debtChecked = false;
    netChecked = false;
    yesNo = [
        {value: 'Yes'},
        {value: 'No'}];

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
    firstTimeHomeBuyerChecked = false;
    files = [];
    purposes: Array<string> = [
        'Purchase of Land',
        'Construction of Building',
        'Purchase of Apartments and Independent Units',
        'Home Improvement',
        'Home Improvement',
        'Purchase of Residential Building',
        'Investment in Business',
        'Investment in Fixed Assets',
        'Investment in Financial Assets (Securities)',
        'Repayment of Personal Debt',
        'Social Obligations/Functions',
        'Family Expenses',
        'Debt Consolidation',
        'Home Improvement, Repair and Maintenance',
        'Debt Consolidation',
        'To Finance Tertiary Education',
        'To Finance Post-Secondary Education'];
    isCombineLoan = false;
    combineLoanList: Array<LoanDataHolder> = [];
    guarantor = new FormControl(undefined, Validators.required);
    existingCombinedLoan = {
        id: undefined,
        version: undefined
    };
    customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
    combinedLoansIds: number[] = [];
    removeFromCombinedLoan = false;
    customerType: any;

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastService,
                private baseInterestService: BaseInterestService,
                private el: ElementRef,
                private nbService: NgbModal,
                private customerInfoService: CustomerInfoService,
                private loanFormService: LoanFormService,
                private spinner: NgxSpinnerService,
                private combinedLoanService: CombinedLoanService) {
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
            this.interestLimit = this.formDataForEdit['interestRate'];
            /*this.proposalForm.get('existingLimit').patchValue(this.formValue.proposedLimit);
            this.proposalForm.get('dateOfExpiry').patchValue(!ObjectUtil.isEmpty(this.formDataForEdit.dateOfExpiry)
                ? new Date(this.formDataForEdit.dateOfExpiry) : undefined);
            this.checkLimitExpiryBuildValidation(this.formDataForEdit.limitExpiryMethod);*/
            this.existInterestLimit = this.formDataForEdit['existInterestRate'];
            if (!ObjectUtil.isEmpty(this.formValue.groupExposure)) {
                this.groupExposureData = JSON.parse(this.formValue.groupExposure);
                this.proposalForm.patchValue(this.groupExposureData);
                this.setGroupExposureData(this.groupExposureData);
            }
        } else {
            this.setActiveBaseRate();
            this.addGroupExposureData();
        }
        if (!this.fromProfile) {
            this.activatedRoute.queryParams.subscribe(
                (paramsValue: Params) => {
                    this.allId = {
                        loanId: null,
                        customerId: null,
                        loanCategory: null,
                        customerType: null,
                    };
                    this.allId = paramsValue;
                    this.loanId = this.allId.loanId ? this.allId.loanId : this.loanIds;
                });
        }
        this.getLoanData();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            if (!ObjectUtil.isEmpty(this.formValue.data)) {
                const data = JSON.parse(this.formValue.data);
                if (!ObjectUtil.isEmpty(data.files)) {
                    this.files = JSON.parse(data.files);
                }
            }
        }

        this.loanFormService.getInitialLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
            this.customerGroupLoanList = res.detail;
            this.customerGroupLoanList
                .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))
                .forEach((l) => this.combinedLoansIds.push(l.id));
            this.removeFromCombinedLoan = this.combinedLoansIds.length > 0;
            if (this.combinedLoansIds.length > 0) {
                const loan = this.customerGroupLoanList
                    .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))[0];
                this.existingCombinedLoan.id = loan.combinedLoan.id;
                this.existingCombinedLoan.version = loan.combinedLoan.version;
            } else {
                this.customerGroupLoanList
                    .filter((ld) => ld.currentStage.toUser.id.toString() === LocalStorageUtil.getStorage().userId)
                    .forEach((l) => this.combinedLoansIds.push(l.id));
            }
        });

        this.proposalForm.get('interestRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(value) - Number(this.proposalForm.get('baseRate').value)).toFixed(8)));
        this.proposalForm.get('baseRate').valueChanges.subscribe(value => this.proposalForm.get('premiumRateOnBaseRate')
            .patchValue((Number(this.proposalForm.get('interestRate').value) - Number(value)).toFixed(8)));
        // this.proposalForm.get('limitExpiryMethod').valueChanges.subscribe(value => this.checkLimitExpiryBuildValidation(value));
        this.checkInstallmentAmount();
        this.proposalForm.get('proposedLimit').valueChanges.subscribe(value => {
            this.proposalForm.get('principalAmount')
                .patchValue(Number(value));
            this.proposedLimit = this.proposalForm.get('proposedLimit').value;
        });
    }

    getLoanData() {
        if (!ObjectUtil.isEmpty(this.loan)) {
            this.loanId = this.loan.loan.id;
        }
        this.loanConfigService.detail(this.loanId).subscribe((response: any) => {
            if (!this.fromProfile) {
                this.loan = new LoanDataHolder();
            }
            this.loan.loan = response.detail;
            this.checkLoan();
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
        this.customerType = this.activatedRoute.snapshot.queryParamMap.get('customerType');
    }


    checkLoan() {
        this.minimumAmountLimit = this.loan.loan.minimumProposedAmount;
        this.collateralRequirement = this.loan.loan.collateralRequirement;
        this.isFundable = this.loan.loan.isFundable;
        this.fundableNonFundableSelcted = !ObjectUtil.isEmpty(this.loan.loan.isFundable);
        this.isFixedDeposit = this.loan.loan.loanTag === 'FIXED_DEPOSIT';
        this.isGeneral = this.loan.loan.loanTag === 'GENERAL';
        this.isShare = this.loan.loan.loanTag === 'SHARE_SECURITY';
        this.isVehicle = this.loan.loan.loanTag === 'VEHICLE';
        this.isHomeLoan = this.loan.loan.loanTag === 'HOME_LOAN';
        this.loanNature = this.loan.loan.loanNature;
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
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            this.interestLimit = this.loan.loan.interestRate;
        }
        this.setCollateralRequirement(this.collateralRequirement);
        // this.checkLoanConfig();
        this.setValidatorForPrepaymentField();
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            // this.existInterestLimit = this.loan.existInterestRate;

        }
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
            disbursementCriteria: [undefined],
            repayment: [undefined],
            borrowerInformation: [undefined],
            interestAmount: [undefined],
            existingLimit: [undefined],
            outStandingLimit: [undefined],
            collateralRequirement: [undefined, Validators.required],
            swapCharge: [undefined],
            subsidizedLoan: [undefined],
            /*limitExpiryMethod: [undefined, Validators.required],
            duration: [undefined, Validators.required],
            condition: [undefined, Validators.required],
            frequency: [undefined, Validators.required],
            dateOfExpiry: [undefined, Validators.required],*/
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
            others: [undefined],

            // Additional Fields--
            // for installment Amount--
            installmentAmount: [undefined],
            principalAmount: [undefined],
            // for moratoriumPeriod Amount--
            moratoriumPeriod: [undefined],
            // for prepaymentCharge Amount--
            prepaymentCharge: [(ObjectUtil.isEmpty(this.proposalData)
                || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? '' :
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
            yesNo1: [undefined],
            yesNo2: [undefined],
            yesNo3: [undefined],
            yesNo4: [undefined],
            yesNo5: [undefined],
            accountStrategy: [undefined],
            files: [undefined],
            deviationConclusionRecommendation: [undefined],
            shares: this.formBuilder.array([]),
            realState: this.formBuilder.array([]),
            vehicle: this.formBuilder.array([]),
            deposit: this.formBuilder.array([]),
            depositBank: [undefined],
            depositOther: [undefined],
            depositBankRemark: [undefined],
            depositOtherRemark: [undefined],
            total: [undefined],
            totals: [undefined],

    });
    }

    setValidatorForPrepaymentField() {
        if ((this.loanNatureSelected && this.fundableNonFundableSelcted &&
            this.isFundable && this.isTerminating) || this.isVehicle || this.isShare || this.isGeneral) {
            this.proposalForm.get('prepaymentCharge').setValidators([Validators.required]);
        } else {
            this.proposalForm.get('prepaymentCharge').clearValidators();
        }
        this.proposalForm.get('prepaymentCharge').updateValueAndValidity();
    }

    checkLoanTypeAndBuildForm() {
        if (this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' || this.loanType === 'PARTIAL_SETTLEMENT_LOAN'
            || this.loanType === 'FULL_SETTLEMENT_LOAN' || this.loanType === 'RENEW_WITH_ENHANCEMENT') {
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

    setIndividualCrgGamma(crgGamma: any): void {
        this.loan.crgGamma = crgGamma;
        console.log(this.loan, 'CRGDATA');
    }

    onSubmit() {
        if (this.customerType === 'INDIVIDUAL') {
            this.crgGammaComponent.onSubmit();
        }
        // Proposal Form Data--
        this.submitted = true;
        this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;
        this.proposalData.existingLimit = this.proposalForm.get('existingLimit').value;
        this.proposalData.outStandingLimit = this.proposalForm.get('outStandingLimit').value;
        this.proposalData.collateralRequirement = this.proposalForm.get('collateralRequirement').value;
        this.proposalData.tenureDurationInMonths = this.proposalForm.get('tenureDurationInMonths').value;
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

      if (!this.fromProfile) {
            if (!ObjectUtil.isEmpty(this.formValue)) {
                this.proposalData = this.formValue;
            }
            this.proposalData.data = JSON.stringify(this.proposalForm.value);

            const mergeChecked = {
                solChecked: this.solChecked,
                waiverChecked: this.waiverChecked,
                riskChecked: this.riskChecked,
                swapChargeChecked: this.swapChargeChecked,
                subsidizedLoanChecked: this.subsidizedLoanChecked,
                deviationChecked: this.deviationChecked,
                commitmentChecked: this.commitmentChecked,
                swapDoubleChargeChecked: this.swapDoubleChargeChecked,
                prepaymentChargeChecked: this.prepaymentChargeChecked,
                purposeChecked: this.purposeChecked,
                debtChecked: this.debtChecked,
                netChecked: this.netChecked,
                firstTimeHomeBuyerChecked: this.firstTimeHomeBuyerChecked
            };
            this.proposalData.checkedData = JSON.stringify(mergeChecked);
            this.proposalData.proposedLimit = this.proposalForm.get('proposedLimit').value;

            // Proposed Limit value--
        } else {
          if (this.proposalForm.invalid) {
              this.toastService.show(new Alert(AlertType.WARNING, 'VALIDATION FAILEDs'));
              return;
          }
            // this.securityAdderComponent.save();
            if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
                this.proposalForm.patchValue(JSON.parse(this.customerInfo.commonLoanData));
                this.proposalData.checkedData = JSON.parse(this.customerInfo.commonLoanData).mergedCheck;
            }
            this.proposalData.data = JSON.stringify(this.proposalForm.value);
            this.loan.proposal = this.proposalData;
            this.spinner.show();
            this.loanFormService.save(this.loan).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan'));
                this.loan = response.detail;
                this.combinedLoansIds.push(this.loan.id);
                if (this.combinedLoansIds.length > 1) {
                    const combinedLoans: LoanDataHolder[] = this.combinedLoansIds.map((id) => {
                        const loan = new LoanDataHolder();
                        loan.id = id;
                        return loan;
                    });
                    const combinedLoan: CombinedLoan = {
                        id: this.existingCombinedLoan.id,
                        loans: combinedLoans.length < 1 ? [] : combinedLoans,
                        version: this.existingCombinedLoan.version
                    };
                    this.combinedLoanService.save(combinedLoan).subscribe(() => {
                        const msg = `Successfully saved combined loan`;
                        this.toastService.show(new Alert(AlertType.SUCCESS, msg));
                        this.emitter.emit(this.loan);
                        this.spinner.hide();
                    }, error => {
                        console.error(error);
                        this.spinner.hide();
                        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save combined loan'));
                    });
                } else {
                    this.spinner.hide();
                    this.emitter.emit(this.loan);
                }
            }, error => {
                this.spinner.hide();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, `Error saving customer: ${error.error.message}`));
            });
        }
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
                    this.proposalForm.get('subsidizedLoan').setValue(null);
                    this.proposalForm.get('subsidyLoanType').setValue(null);
                }
                break;
            case 'swapChVar':
                if (event) {
                    this.swapChargeVar = true;
                } else {
                    this.swapChargeVar = false;
                    // this.proposalForm.get('subsidizedLoan').setValue(null);
                    // this.proposalForm.get('subsidyLoanType').setValue(null);
                }
                break;
            case 'subsidizedLoan':
                if (event) {
                    this.subsidizedLoanChecked = true;
                } else {
                    this.subsidizedLoanChecked = false;
                    this.proposalForm.get('subsidizedLoan').setValue(null);
                    this.proposalForm.get('subsidyLoanType').setValue(null);
                }
                break;
            case 'deviation':
                if (event) {
                    this.deviationChecked = true;
                } else {
                    this.deviationChecked = false;
                    this.proposalForm.get('deviationConclusionRecommendation').setValue(null);
                }
                break;
            case 'commitment': {
                this.commitmentChecked = event;
            }
                break;
            case 'swapDoubleCharge': {
                this.swapDoubleChargeChecked = event;
            }
                break;
            case 'prepayment': {
                this.prepaymentChargeChecked = event;
            }
                break;
            case 'purpose': {
                this.purposeChecked = event;
            }
                break;
            case 'debt': {
                this.debtChecked = event;
            }
                break;
            case 'net': {
                this.netChecked = event;
            }
                break;
            case 'firstTimeHomeBuyer':
                if (event) {
                  this.firstTimeHomeBuyerChecked = true;
                } else {
                  this.firstTimeHomeBuyerChecked = false;
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
      this.checkChecked(data['swapChargeVar'], 'swapChVar');
      this.checkChecked(data['firstTimeHomeBuyerChecked'], 'firstTimeHomeBuyer');
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
    const moratoriumPeriod = this.proposalForm.get('moratoriumPeriod').value;
    const rate = Number(this.proposalForm.get('interestRate').value) / (12 * 100);
    const n = this.proposalForm.get('tenureDurationInMonths').value;
    if (!ObjectUtil.isEmpty(moratoriumPeriod)) {
        if (!ObjectUtil.isEmpty(n) && !ObjectUtil.isEmpty(proposedAmount)) {
            const emi = Number(proposedAmount / Number(n - moratoriumPeriod));
            switch (repaymentMode) {
                case 'emi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(8)));
                    break;
                case 'eqi':
                    this.proposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(8)));
                    break;
            }
        }
    } else {
        if (proposedAmount && rate && n) {
            const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
            console.log(emi, 'emi');
            switch (repaymentMode) {
                case 'emi':
                    this.proposalForm.get('installmentAmount').patchValue(Number(emi.toFixed(8)));
                    break;
                case 'eqi':
                    this.proposalForm.get('installmentAmount').patchValue(Number((emi * 3).toFixed(8)));
                    break;
            }
        } else {
            this.proposalForm.get('installmentAmount').patchValue(undefined);
        }
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
        this.proposalForm.get('interestAmount').patchValue(Number((interestAmount).toFixed(8)));
      }if (key === 'PRINCIPAL') {
        this.proposalForm.get('principalAmount').patchValue(Number((principleAmount).toFixed(8)));
      }
    }
  }

  setCollateralRequirement(collateralRequirement) {
    if (ObjectUtil.isEmpty(this.proposalForm.get('collateralRequirement').value)) {
      this.proposalForm.get('collateralRequirement').patchValue(collateralRequirement);
    }
  }

 /* checkLimitExpiryBuildValidation(limitExpiry) {
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
  }*/

  checkInstallmentAmount() {
    if (this.proposalForm.get('repaymentMode').value === 'EMI' || this.proposalForm.get('repaymentMode').value === 'EQI') {
      this.showInstallmentAmount = true;
      this.showRepaymentMode = false;
      this.checkRepaymentMode();
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , false);
    } else if (this.proposalForm.get('repaymentMode').value === 'CUSTOM') {
      this.showRepaymentMode = true;
      this.showInstallmentAmount = false;
      this.controlValidation(['repaymentModeInterest' , 'repaymentModePrincipal'] , true);
    } else {
      this.calculateInterestAmountForRepaymentMode();
      this.showInstallmentAmount = false;
      this.showRepaymentMode = false;
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
          default:
            return;
        }

    }

    calculateInterestAmountForRepaymentMode() {
        const proposeLimit = Number(this.proposalForm.get('proposedLimit').value);
        const interestRate = Number(this.proposalForm.get('interestRate').value);
        const tenureDurationInMonths = Number(this.proposalForm.get('tenureDurationInMonths').value) / 12;
        const interestAmount = (proposeLimit * (interestRate / 100) * tenureDurationInMonths) / 12;
        this.proposalForm.get('interestAmount').setValue(Number(interestAmount).toFixed(8));
        this.proposalForm.get('principalAmount').setValue(Number(proposeLimit).toFixed(8));
    }

  calculateInterestRate() {
    const baseRate = Number(this.proposalForm.get('baseRate').value);
    const premiumRateOnBaseRate = Number(this.proposalForm.get('premiumRateOnBaseRate').value);
    const discountRate = Number(this.proposalForm.get('subsidizedLoan').value);

    const interestRate = (baseRate - discountRate + premiumRateOnBaseRate);
    return this.proposalForm.get('interestRate').setValue(Number(interestRate).toFixed(8));
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

  setGroupExposureData(data) {
    const groupExposuresArray = this.proposalForm.get('groupExposure') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        groupExposuresArray.push(this.formBuilder.group({
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
      const facilityType = data.get('facilityType').value;
      const loanLimit = data.get('loanLimit').value;
      const osLimit = data.get('osLimit').value;
      const proposedLimit = data.get('proposedLimit').value;
      const fmvDv = data.get('fmvDv').value;
      const exposure = data.get('exposure').value;
      if (ObjectUtil.isEmpty(facilityType) && ObjectUtil.isEmpty(loanLimit) && ObjectUtil.isEmpty(osLimit)
          && ObjectUtil.isEmpty(proposedLimit) && ObjectUtil.isEmpty(fmvDv) && ObjectUtil.isEmpty(exposure)) {
        this.isAllExposureFieldNull = true;
      } else {
        this.isAllExposureFieldNull = false;
      }
    });
  }

    getData(data) {
        this.files = data;
        this.proposalForm.patchValue({
            files: JSON.stringify(data)
        });
    }

    guarantors(guarantors) {
        this.loan.taggedGuarantors = guarantors;
    }

    setLoanHolder(loan: LoanDataHolder) {
        this.loan = loan;
    }
}

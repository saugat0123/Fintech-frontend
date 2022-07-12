import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {LoanType} from '../../../../loan/model/loanType';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ExistingExposure} from '../../../../loan/model/existingExposure';

@Component({
    selector: 'app-common-loan-information',
    templateUrl: './common-loan-information.component.html',
    styleUrls: ['./common-loan-information.component.scss']
})
export class CommonLoanInformationComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    @Output() emitter = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private customerInfoService: CustomerInfoService,
        private toastService: ToastService,
        private spinnerService: NgxSpinnerService,
        private loanFormService: LoanFormService,
        private loanConfigService: LoanConfigService
    ) {
    }

    commonLoanForm: FormGroup;
    commonLoans: ExistingExposure [] = [];
    conditionalArray: {
        checkApproved: boolean,
        isFundable: boolean,
        fundableNonFundableSelcted: boolean,
        isFixedDeposit: boolean,
        loanNature: any,
        loanNatureSelected: boolean,
        isRevolving: boolean,
        isTerminating: boolean,
        isGeneral: boolean,
        isVehicle: boolean,
        isShare: boolean,
        showInstallmentAmount: boolean,
        showRepaymentMode: boolean,
        swapChargeChecked: boolean,
        othersSubsidyLoan: boolean,
        showInterestAmount: boolean,
    } [] = [];
    loanTypeList = LoanType.value();
    multipleSelectedLoanType = [];
    loanList = [];
    ngOnInit() {
        this.buildForm();
        this.getAllLoans();
        if (!ObjectUtil.isEmpty(this.customerInfo.existingExposures)) {
            this.commonLoans = this.customerInfo.existingExposures;
            this.setLoans();
        }
    }

    buildForm() {
        this.commonLoanForm = this.formBuilder.group({
            data: this.formBuilder.array([])
        });
    }

    addLoans() {
        const formArray = (this.commonLoanForm.get('data') as FormArray);
        const exposure = this.formBuilder.group({
            proposalData: this.addExistingExposure(),
            loanType: ['NEW_LOAN'],
            loanName: [undefined],
            docStatus: ['APPROVED'],
            loanConfig: [undefined],
            id: [undefined]
        });
        formArray.push(exposure);
        const c: ExistingExposure = new ExistingExposure();
        this.commonLoans.push(c);
    }
    sliceLoan() {
        this.loanTypeList.forEach((val) => {
            if (val.key === 'CLOSURE_LOAN' || val.key === 'PARTIAL_SETTLEMENT_LOAN' || val.key === 'FULL_SETTLEMENT_LOAN'
                || val.key === 'RELEASE_AND_REPLACEMENT' || val.key === 'PARTIAL_RELEASE_OF_COLLATERAL'
                || val.key === 'INTEREST_RATE_REVISION') {
                return true;
            }
            this.multipleSelectedLoanType.push(val);

        });
    }
    setLoans() {
        const formArray = (this.commonLoanForm.get('data') as FormArray);
        this.commonLoans.forEach((e, i) => {
            formArray.push(this.formBuilder.group({
                proposalData: this.addExistingExposure(),
                loanType: [e.loanType],
                loanName: [e.loanName],
                loanId: [e.loanId],
                loanConfig: [e.loanConfig],
                docStatus: [e.docStatus],
                originalLimit: [e.originalLimit],
                id: [e.id]
            }));
            this.setProposalData(JSON.parse(e.proposalData), i);
        });
        this.setFormCondition();
    }
    setFormCondition() {
        this.commonLoanForm.get('data').value.forEach((d, i) => {
            this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').patchValue(d.originalLimit);
            this.setCondition(i);
            this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(value) + Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').value)).toFixed(2)));
            this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').value) + Number(value)).toFixed(2)));
            this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').valueChanges.subscribe(value => {
                this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount')
                    .patchValue(Number(value));
            });
            this.checkInstallmentAmount(i);
        });
    }

    removeLoans(i) {
        (this.commonLoanForm.get('data') as FormArray).removeAt(i);
        this.conditionalArray.splice(i, 1);
        this.commonLoans.splice(i, 1);
        this.toastService.show(new Alert(AlertType.INFO, 'Please Save To Remove The Loan'));
    }

    save() {
        this.spinnerService.show();
        this.setAllExposure();
        this.customerInfoService.saveExistingExposure(this.commonLoans, this.customerInfo.id).subscribe(
            {
                next: (res) => {

                },
                error: (err) => {
                    this.spinnerService.hide();
                    this.toastService.show(new Alert(AlertType.DANGER, 'Error While Saving Common Loan'));
                },
                complete: () => {
                    this.spinnerService.hide();
                    this.emitter.emit();
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Save Common Loan'));
                }
            });
    }

    setAllExposure() {
        const formArray = (this.commonLoanForm.get('data'));
        formArray.value.forEach((d, i) => {
            this.commonLoans[i].proposalData = JSON.stringify(d.proposalData);
            this.commonLoans[i].docStatus = d.docStatus;
            this.commonLoans[i].loanConfig = d.loanConfig;
            this.commonLoans[i].loanName = d.loanConfig.name;
            this.commonLoans[i].loanType = d.loanType;
            this.commonLoans[i].originalLimit = Number(d.proposalData.existingLimit);
        });
    }

    calculateLimitValues(i) {

        switch (this.commonLoanForm.get(['data', i, 'loanType']).value) {
            case  'PARTIAL_SETTLEMENT_LOAN':
                const newLimit = this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').value - this.commonLoanForm.get(['data', i, 'proposalData']).get('settlementAmount').value;
                this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').setValue(NumberUtils.isNumber(newLimit));
                return;
            case  'ENHANCED_LOAN':
                const enhancementAmount = this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').value - this.commonLoanForm.get(['data', i, 'proposalData']).get('enhanceLimitAmount').value;
                this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').setValue(NumberUtils.isNumber(enhancementAmount));
                return;
            case  'RENEW_WITH_ENHANCEMENT':
                const enhanceLimit = this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').value + this.commonLoanForm.get(['data', i, 'proposalData']).get('enhanceLimitAmount').value;
                this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').setValue(NumberUtils.isNumber(enhanceLimit));
                return;
            default:
                return;
        }

    }

    checkRepaymentMode(i) {
        if (this.conditionalArray[i].showInstallmentAmount) {
            this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue(0);
            const repaymentMode = this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value;

            switch (repaymentMode) {
                case 'EMI':
                    this.calculateEmiEqiAmount('emi', i);
                    break;
                case 'EQI':
                    this.calculateEmiEqiAmount('eqi', i);
                    break;
            }
        } else {
            this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue(0);
        }
    }

    calculateEmiEqiAmount(repaymentMode, i) {
        const proposedAmount = this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').value;
        const rate = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate').value) / (12 * 100);
        const n = this.commonLoanForm.get(['data', i, 'proposalData']).get('tenureDurationInMonths').value;
        const eqiRate = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate').value) / (4 * 100);
        if (proposedAmount && rate && n) {
            const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
            const eqi = Number((proposedAmount * eqiRate * Math.pow(1 + eqiRate, n / 4)) / Number(Math.pow(1 + eqiRate, n / 4) - 1));
            switch (repaymentMode) {
                case 'emi':
                    this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue(Number(emi.toFixed(2)));
                    break;
                case 'eqi':
                    this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue(Number(eqi.toFixed(2)));
                    break;
            }
        } else {
            // this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue();
        }
    }

    checkCustomRepaymentMode(i) {
        if (this.conditionalArray[i].showRepaymentMode) {
            this.calculateRepaymentModeAmounts(this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModePrincipal').value, 'PRINCIPAL', i);
            this.calculateRepaymentModeAmounts(this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModeInterest').value, 'INTEREST', i);
        }
    }

    checkInstallmentAmount(i) {
        if (this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'EMI' || this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'EQI') {
            this.conditionalArray[i].showRepaymentMode = false;
            this.conditionalArray[i].showInstallmentAmount = true;
            this.checkRepaymentMode(i);
        } else if (this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'CUSTOM') {
            this.conditionalArray[i].showInterestAmount = false;
            this.conditionalArray[i].showRepaymentMode = true;
            this.conditionalArray[i].showInstallmentAmount = false;
        } else {
            this.calculateInterestAmountForRepaymentMode(i);
            this.conditionalArray[i].showInstallmentAmount = false;
            this.conditionalArray[i].showRepaymentMode = false;
            this.conditionalArray[i].showInterestAmount = true;
        }
    }

    calculateInterestAmountForRepaymentMode(i) {
        const proposeLimit = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').value);
        const interestRate = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate').value);
        const tenureDurationInMonths = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('tenureDurationInMonths').value) / 12;
        const interestAmount = (proposeLimit * (interestRate / 100) * tenureDurationInMonths) / 12;
        this.commonLoanForm.get(['data', i, 'proposalData']).get('interestAmount').setValue(Number(interestAmount).toFixed(2));
        this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount').setValue(Number(proposeLimit).toFixed(2));
    }

    calculateRepaymentModeAmounts(repaymentMode, key, i) {
        let principleAmount = 0;
        let interestAmount = 0;
        const rate = Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate').value) / 100;
        const proposedAmount = this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').value;
        const tenure = this.commonLoanForm.get(['data', i, 'proposalData']).get('tenureDurationInMonths').value;
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
                this.commonLoanForm.get(['data', i, 'proposalData']).get('interestAmount').patchValue(Number((interestAmount).toFixed(2)));
            }
            if (key === 'PRINCIPAL') {
                this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount').patchValue(Number((principleAmount).toFixed(2)));
            }
        }
    }


    setCondition(i) {
        const data = this.commonLoanForm.get(['data', i , 'loanConfig']).value as LoanConfig;
        const loanType = this.commonLoanForm.get(['data', i , 'loanType']).value;
        const check = {
            checkApproved: false,
            isFundable: false,
            fundableNonFundableSelcted: false,
            isFixedDeposit: false,
            loanNature: null,
            loanNatureSelected: false,
            isRevolving: false,
            isTerminating: false,
            isGeneral: false,
            isVehicle: false,
            isShare: false,
            showInstallmentAmount: false,
            showRepaymentMode: false,
            swapChargeChecked: false,
            othersSubsidyLoan: false,
            showInterestAmount: false,
        };
        if (loanType === 'RENEWED_LOAN' || loanType === 'ENHANCED_LOAN' || loanType === 'PARTIAL_SETTLEMENT_LOAN'
            || loanType === 'FULL_SETTLEMENT_LOAN' || loanType === 'RENEW_WITH_ENHANCEMENT') {
            check.checkApproved = true;
        }
        check.isFundable = data.isFundable;
        check.fundableNonFundableSelcted = !ObjectUtil.isEmpty(data.isFundable);
        check.isFixedDeposit = data.loanTag === 'FIXED_DEPOSIT';
        check.isGeneral = data.loanTag === 'GENERAL';
        check.isShare = data.loanTag === 'SHARE_SECURITY';
        check.isVehicle = data.loanTag === 'VEHICLE';
        check.loanNature = data.loanNature;
        if (!ObjectUtil.isEmpty(check.loanNature)) {
            check.loanNatureSelected = true;
            check.isTerminating = check.loanNature === 'Terminating';
            check.isRevolving = check.loanNature === 'Revolving';
            if (check.isRevolving) {
                check.isGeneral = false;
            }
        }
        if (!check.isFundable) {
            check.isGeneral = false;
        }
        if (check.isFixedDeposit) {
            check.loanNatureSelected = false;
            check.fundableNonFundableSelcted = false;
        }
        this.conditionalArray[i] = check;
    }

    resetData(id: number, index: number) {
        let data = null;
        this.loanFormService.detail(id).subscribe({
            next: (res) => {
                const loanData: LoanDataHolder = res.detail;
                data = loanData.proposal.data;
            },
            error: (err) => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Something Went Wrong'));
            },
            complete: () => {
                this.commonLoanForm.get(['data', index, 'proposalData']).patchValue(JSON.parse(data));
                this.toastService.show(new Alert(AlertType.INFO, 'Please Save To Apply The Changes'));
            }
        });
    }
    addExistingExposure() {
   return   this.formBuilder.group({
         proposedLimit: [undefined, [Validators.required, Validators.min(0)]],
         interestRate: [undefined],
         baseRate: [undefined],
         premiumRateOnBaseRate: [undefined],
         serviceChargeMethod: ['PERCENT'],
         swapChargeMethod: ['PERCENT'],
         serviceCharge: [undefined],
         tenureDurationInMonths: [undefined],
         repaymentMode: ['EMI'],
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
         prepaymentCharge: [0],
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
         borrowingCase: [undefined],
         endUseOfFund: [undefined],
         justificationChangeHistorical: [undefined],
         justificationChangeProjection: [undefined],
         fixedAssetsSummary: this.formBuilder.array([]),
         summaryEnvironment: this.formBuilder.group({
             priority: [undefined],
             criticalSectorList: [undefined],
             criticalSector: [undefined],
             processApplicable: [undefined],
         }),
         justification: [undefined],
         currentRequest: [undefined]
     });
    }

    getAllLoans() {
        this.sliceLoan();
        this.loanConfigService.getAllByLoanCategory(this.customerInfo.customerType).subscribe((response: any) => {
            this.loanList = response.detail;
            this.loanList = this.loanList.filter(f => f.isRemit === false);
        }, (err) => {
            this.toastService.show(new Alert(AlertType.DANGER, '!!OPPS Something Went Wrong'));
        });
    }
    setLoan(event, i) {
        this.commonLoanForm.get(['data', i , 'loanName']).patchValue(event.name);
            this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').patchValue(0);
            this.setCondition(i);
            this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(value) + Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').value)).toFixed(2)));
            this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').value) + Number(value)).toFixed(2)));
            this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').valueChanges.subscribe(value => {
                this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount')
                    .patchValue(Number(value));
            });
            this.checkInstallmentAmount(i);
    }

    private setProposalData(formDataForEdit: any, i) {
        this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').setValue(formDataForEdit.proposedLimit);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate').setValue(formDataForEdit.interestRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').setValue(formDataForEdit.baseRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').setValue(formDataForEdit.premiumRateOnBaseRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('serviceChargeMethod').setValue(formDataForEdit.serviceChargeMethod);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('swapChargeMethod').setValue(formDataForEdit.swapChargeMethod);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('tenureDurationInMonths').setValue(formDataForEdit.tenureDurationInMonths);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').setValue(formDataForEdit.repaymentMode);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModeInterest').setValue(formDataForEdit.repaymentModeInterest);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModePrincipal').setValue(formDataForEdit.repaymentModePrincipal);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('disbursementCriteria').setValue(formDataForEdit.disbursementCriteria);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('repayment').setValue(formDataForEdit.repayment);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('borrowerInformation').setValue(formDataForEdit.borrowerInformation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('interestAmount').setValue(formDataForEdit.interestAmount);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('existingLimit').setValue(formDataForEdit.existingLimit);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('outStandingLimit').setValue(formDataForEdit.outStandingLimit);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('collateralRequirement').setValue(formDataForEdit.collateralRequirement);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('swapCharge').setValue(formDataForEdit.swapCharge);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('subsidizedLoan').setValue(formDataForEdit.subsidizedLoan);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('remark').setValue(formDataForEdit.remark);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('cashMargin').setValue(formDataForEdit.cashMargin);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('commissionPercentage').setValue(formDataForEdit.commissionPercentage);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('commissionFrequency').setValue(formDataForEdit.commissionFrequency);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('couponRate').setValue(formDataForEdit.couponRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumOnCouponRate').setValue(formDataForEdit.premiumOnCouponRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('tenorOfEachDeal').setValue(formDataForEdit.tenorOfEachDeal);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('cashMarginMethod').setValue(formDataForEdit.cashMarginMethod);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('enhanceLimitAmount').setValue(formDataForEdit.enhanceLimitAmount);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('subsidyLoanType').setValue(formDataForEdit.subsidyLoanType);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('others').setValue(formDataForEdit.others);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').setValue(formDataForEdit.installmentAmount);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount').setValue(formDataForEdit.principalAmount);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('moratoriumPeriod').setValue(formDataForEdit.moratoriumPeriod);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('prepaymentCharge').setValue(formDataForEdit.prepaymentCharge);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('commitmentFee').setValue(formDataForEdit.commitmentFee);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('solConclusionRecommendation').setValue(formDataForEdit.solConclusionRecommendation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('waiverConclusionRecommendation').setValue(formDataForEdit.waiverConclusionRecommendation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('riskConclusionRecommendation').setValue(formDataForEdit.riskConclusionRecommendation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('summeryRecommendation').setValue(formDataForEdit.summeryRecommendation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('purposeOfLoan').setValue(formDataForEdit.purposeOfLoan);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('termsAndCondition').setValue(formDataForEdit.termsAndCondition);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('prepaymentSwapCommitment').setValue(formDataForEdit.prepaymentSwapCommitment);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('existCashMargin').setValue(formDataForEdit.existCashMargin);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('existCashMarginMethod').setValue(formDataForEdit.existCashMarginMethod);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('existInterestRate').setValue(formDataForEdit.existInterestRate);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('existCommissionPercentage').setValue(formDataForEdit.existCommissionPercentage);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('settlementAmount').setValue(formDataForEdit.settlementAmount);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('files').setValue(formDataForEdit.files);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('deviationConclusionRecommendation').setValue(formDataForEdit.deviationConclusionRecommendation);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('depositBank').setValue(formDataForEdit.depositBank);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('depositOther').setValue(formDataForEdit.depositOther);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('depositBankRemark').setValue(formDataForEdit.depositBankRemark);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('depositOtherRemark').setValue(formDataForEdit.depositOtherRemark);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('total').setValue(formDataForEdit.total);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('totals').setValue(formDataForEdit.totals);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('borrowingCase').setValue(formDataForEdit.borrowingCase);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('endUseOfFund').setValue(formDataForEdit.endUseOfFund);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('justificationChangeHistorical').setValue(formDataForEdit.justificationChangeHistorical);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('justificationChangeProjection').setValue(formDataForEdit.justificationChangeProjection);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('justification').setValue(formDataForEdit.justification);
        this.commonLoanForm.get(['data', i, 'proposalData']).get('currentRequest').setValue(formDataForEdit.currentRequest);
    }

    fullSettle(id) {
        this.spinnerService.show();
        this.customerInfoService.saveExposureToLoan(id, this.customerInfo.id).subscribe({
            next: (res: any) => {
            },
            error: (err: any) => {
                this.spinnerService.hide();
                this.toastService.show(new Alert(AlertType.ERROR,  err.toString()));
            },
            complete: () => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Converted To Loan'));
                this.spinnerService.hide();
            }
        });
    }
}

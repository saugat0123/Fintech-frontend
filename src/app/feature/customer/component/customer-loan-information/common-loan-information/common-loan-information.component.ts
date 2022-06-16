import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanType} from '../../../../loan/model/loanType';

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
        private spinnerService: NgxSpinnerService) {
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

    ngOnInit() {
        this.buildForm();
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
        formArray.push(this.formBuilder.group({
            proposalData: this.formBuilder.group({}),
            loanType: [undefined],
            loanName: [undefined],
        }));
    }

    setLoans() {
        const formArray = (this.commonLoanForm.get('data') as FormArray);
        this.commonLoans.forEach((e, i) => {
            formArray.push(this.formBuilder.group({
                proposalData: this.formBuilder.group(JSON.parse(e.proposalData)),
                loanType: [e.loanType],
                loanName: [e.loanName],
            }));
            this.setCondition(i);
            this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(value) + Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').value)).toFixed(2)));
            this.commonLoanForm.get(['data', i, 'proposalData']).get('baseRate').valueChanges.subscribe(value => this.commonLoanForm.get(['data', i, 'proposalData']).get('interestRate')
                .patchValue((Number(this.commonLoanForm.get(['data', i, 'proposalData']).get('premiumRateOnBaseRate').value) + Number(value)).toFixed(2)));
            this.checkInstallmentAmount(i);
            this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').valueChanges.subscribe(value => {
                this.commonLoanForm.get(['data', i, 'proposalData']).get('principalAmount')
                    .patchValue(Number(value));
            });
        });
    }

    removeLoans(i) {
        (this.commonLoanForm.get('data') as FormArray).removeAt(i);
        this.commonLoans.splice(i, 1);
        this.toastService.show(new Alert(AlertType.INFO, 'Please Save To Remove The Loan'));
    }

    save() {
        this.spinnerService.show();
        this.setAllExposure();
        console.log('this is common loan', this.commonLoans);
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
        console.log('this is proposal data of index', this.commonLoanForm.get(['data', i, 'proposalData']));
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
        const data = this.commonLoans[i].loanConfig as LoanConfig;
        const loanType = this.commonLoans[i].loanType;
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
        console.log('this iasdasd', check);
        this.conditionalArray.push(check);
    }

}

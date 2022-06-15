import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
    selector: 'app-common-loan-information',
    templateUrl: './common-loan-information.component.html',
    styleUrls: ['./common-loan-information.component.scss']
})
export class CommonLoanInformationComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;

    constructor(
        private formBuilder: FormBuilder,
        private customerInfoService: CustomerInfoService,
        private toastService: ToastService,
        private spinnerService: NgxSpinnerService, private dialogService: NbDialogRef<CommonLoanInformationComponent>) {
    }

    commonLoanForm: FormGroup;
    commonLoans: ExistingExposure [] = [];
    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo.existingExposures)) {
            this.commonLoans = this.customerInfo.existingExposures;
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
            id: [undefined],
            loanId: [undefined],
            proposalData: this.formBuilder.group({}),
            loanTypes: [undefined],
            version: [0],
            loanName: [undefined],
        }));
    }

    setLoans() {
        const formArray = (this.commonLoanForm.get('data') as FormArray);
        this.commonLoans.forEach((e) => {
            formArray.push(this.formBuilder.group({
                id: [e.id],
                loanId: [e.loanId],
                proposalData: this.formBuilder.group(JSON.parse(e.proposalData)),
                loanTypes: [e.loanType],
                version: [e.version],
                loanName: [e.loanName]
            }));
        });
    }

    removeLoans(i) {
        (this.commonLoanForm.get('data') as FormArray).removeAt(i);
    }

    save() {
        this.spinnerService.show();
        this.commonLoans = this.setAllExposure();
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
                    this.dialogService.close();
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Save Common Loan'));
                }
            });
    }

    setAllExposure(): ExistingExposure [] {
        const exposureArray: ExistingExposure [] = [];
        const formArray = (this.commonLoanForm.get('data'));
        formArray.value.forEach((d, i) => {
            const existingExposure = new ExistingExposure();
            existingExposure.proposalData = JSON.stringify(d.proposalData);
            existingExposure.loanId = d.loanId;
            existingExposure.id = d.id;
            existingExposure.loanType = d.loanType;
            existingExposure.version = d.version;
            existingExposure.loanName = d.loanName;
            exposureArray.push(existingExposure);
        });
        return exposureArray;
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
        this.commonLoanForm.get(['data', i, 'proposalData']).get('proposedLimit').setValue(0);
        const repaymentMode = this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value;
        switch (repaymentMode) {
            case 'EMI':
                this.calculateEmiEqiAmount('emi', i);
                break;
            case 'EQI':
                this.calculateEmiEqiAmount('eqi', i);
                break;
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
            this.commonLoanForm.get(['data', i, 'proposalData']).get('installmentAmount').patchValue(undefined);
        }
    }

    checkCustomRepaymentMode(i) {
        // if (this.showRepaymentMode) {
        this.calculateRepaymentModeAmounts(this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModePrincipal').value, 'PRINCIPAL', i);
        this.calculateRepaymentModeAmounts(this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentModeInterest').value, 'INTEREST', i);
        // }
    }

    checkInstallmentAmount(i) {
        if (this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'EMI' || this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'EQI') {
            this.checkRepaymentMode(i);
        } else if (this.commonLoanForm.get(['data', i, 'proposalData']).get('repaymentMode').value === 'CUSTOM') {
            // this.showInterestAmount = false;
            // this.showRepaymentMode = true;
            // this.showInstallmentAmount = false;
            // this.controlValidation(['repaymentModeInterest', 'repaymentModePrincipal'], true);
        } else {
            // this.calculateInterestAmountForRepaymentMode();
            // this.showInstallmentAmount = false;
            // this.showRepaymentMode = false;
            // this.showInterestAmount = true;
        }
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

}

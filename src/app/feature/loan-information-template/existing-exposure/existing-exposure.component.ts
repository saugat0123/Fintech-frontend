import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ExistingExposure} from '../../loan/model/existingExposure';

@Component({
    selector: 'app-existing-exposure',
    templateUrl: './existing-exposure.component.html',
    styleUrls: ['./existing-exposure.component.scss']
})
export class ExistingExposureComponent implements OnInit {
    @Input() customerType;
    @Input() customerInfo: CustomerInfoData;

    existingExposure: FormGroup;
    submitted = false;
    loanList = [];
    selectedLoanList = [];
    existingData: ExistingExposure = new ExistingExposure();

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private loanFormService: LoanFormService,
                private customerInfoService: CustomerInfoService) {
    }

    ngOnInit() {
        console.log('customerInfo', this.customerInfo);
        this.buildForm();
        if (this.customerInfo.existingExposures.length > 0) {
            const exposure = this.customerInfo.existingExposures;
            console.log('exposure', exposure);
        } else {
            this.getApprovedLoanList();
        }
        this.getAllLoanList();
        // this.addExposure();
    }

    buildForm() {
        this.existingExposure = this.formBuilder.group({
            exposure: this.formBuilder.array([]),
        });
    }

    get formControls() {
        return this.existingExposure.controls;
    }

    private getAllLoanList() {
        let listOfLoan = [];
        this.loanConfigService.getAllByLoanCategory(this.customerType)
            .subscribe((res: any) => {
                listOfLoan = res.detail;
            }, (error) => {
                this.toastService.show(new Alert(AlertType.DANGER, 'Cannot get loan list '));
            }, () => {
                this.sliceLoan(listOfLoan);
            });
    }

    private sliceLoan(loanList: any[]) {
        this.loanList = [];
        loanList.forEach((val) => {
            if (val.key === 'CLOSURE_LOAN' || val.key === 'PARTIAL_SETTLEMENT_LOAN' || val.key === 'FULL_SETTLEMENT_LOAN'
                || val.key === 'RELEASE_AND_REPLACEMENT' || val.key === 'PARTIAL_RELEASE_OF_COLLATERAL'
                || val.key === 'INTEREST_RATE_REVISION') {
                return true;
            }
            this.loanList.push(val);
        });
        console.log('listOfLoan', this.loanList);
        this.selectedLoanList = this.loanList[0]['key'];
        console.log('selectedLoanList', this.selectedLoanList);
    }

    addExposure() {
        (this.existingExposure.get('exposure') as FormArray).push(
            this.formBuilder.group({
                Proposal: [undefined, [Validators.required, Validators.min(0)]],
                interestRate: [undefined],
                baseRate: [undefined],
                premiumRateOnBaseRate: [undefined],
                // serviceChargeMethod: ['PERCENT'],
                // swapChargeMethod: ['PERCENT'],
                // serviceCharge: [undefined],
                tenureDurationInMonths: [undefined],
                // repaymentMode: [undefined],
                // repaymentModeInterest: [undefined],
                // repaymentModePrincipal: [undefined],
                // disbursementCriteria: [undefined],
                // repayment: [undefined],
                // borrowerInformation: [undefined],
                // interestAmount: [undefined],
                existingLimit: [undefined],
                outStandingLimit: [undefined],
                // collateralRequirement: [undefined, Validators.required],
                // swapCharge: [undefined],
                // subsidizedLoan: [undefined],
                // remark: [undefined],
                cashMargin: [undefined],
                commissionPercentage: [undefined],
                // commissionFrequency: [undefined],
                // couponRate: [undefined],
                // premiumOnCouponRate: [undefined],
                // tenorOfEachDeal: [undefined],
                // cashMarginMethod: ['PERCENT'],
                enhanceLimitAmount: [undefined],
                // subsidyLoanType: [undefined],
                // others: [undefined],
                // installmentAmount: [undefined],
                // principalAmount: [undefined],
                // moratoriumPeriod: [undefined],
                // prepaymentCharge: [(ObjectUtil.isEmpty(this.proposalData)
                //     || ObjectUtil.isEmpty(this.proposalData.prepaymentCharge)) ? '' :
                //     this.existingExposure.prepaymentCharge],
                commitmentFee: [undefined],
                existCashMargin: [undefined],
                // existCashMarginMethod: ['PERCENT'],
                existInterestRate: [undefined],
                existCommissionPercentage: [undefined],
                settlementAmount: [undefined],
                // files: [undefined],

                // Pricing Table
                // interestCardRate: [undefined],
                // interestDevCardRate: [undefined],
                // processDevCardRate: [undefined],
                // commissionDevCardRate: [undefined],
                // cashMarginDevCardRate: [undefined],
                // processCardRate: [undefined],
                // processExistingRate: [undefined],
                // processProposedRate: [undefined],
                // commissionsCardRate: [undefined],
                // cashCardRate: [undefined],
                // prepaymentCardRate: [undefined],
                // prepaymentExistingRate: [undefined],
                // strCharge: [undefined],
                // AdminFee: [undefined],
                // other: [undefined],
                existingDateOfExpiry: [undefined],

                loanTag: [undefined],
                isFundable: [undefined],
                loanNature: [undefined],
                loanType: [undefined],
                loanName: [undefined]
            })
        );
    }

    getApprovedLoanList() {
        this.loanFormService.getLoansByLoanHolderIdAndDocStatus(this.customerInfo.id, 'APPROVED')
            .subscribe((res: any) => {
                const approvedLoanList = res.detail;
                approvedLoanList.forEach(al => {
                    this.setApprovedLoanData(al);
                });
                console.log('exposure value', this.existingExposure.get('exposure'));
                console.log('res', res);
            });
    }

    arsedTest(data) {
        console.log('Thgi sasdflaksdjf;laksjdf ' ,data);
    }

    setApprovedLoanData(data: any) {
        console.log('data', data);
        const control = this.existingExposure.get('exposure') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            control.push(
                this.formBuilder.group({
                    proposalData: this.addProposalData(data),
                    loanName: [data.loan.name],
                    loanNature: [data.loan.loanNature],
                    loanType: [data.loanType],
                    loanConfig: [data.loan],
                    docStatus: [data.docStatus],
                    loanId: [data.id],
                    originalLimit: [data.proposal.proposedLimit]
                })
            );
        }
    }

    setSavedData() {

    }

    removeLoan(i: number) {
        (this.existingExposure.get('exposure') as FormArray).removeAt(i);
    }

    calculateRate(i: number, controlName) {
        let total = 0;
        const base = Number(this.existingExposure.get(['exposure', i, 'baseRate']).value);
        const premiumRate = Number(this.existingExposure.get(['exposure', i, 'premiumRateOnBaseRate']).value);
        const interest = Number(this.existingExposure.get(['exposure', i, 'interestRate']).value);
        switch (controlName) {
            case 'baseRate':
                total = base + premiumRate;
                this.existingExposure.get(['exposure', i, 'interestRate']).setValue(Number(total).toFixed(2));
                break;
            case 'interestRate':
                total = interest - base;
                this.existingExposure.get(['exposure', i, 'premiumRateOnBaseRate']).setValue(Number(total).toFixed(2));
                break;
            default:
                return;
        }
    }

    calculateLimitValues(type: string, i: number) {
        let totalLimit = 0;
        const existingLimit = Number(this.existingExposure.get(['exposure', i, 'existingLimit']).value);
        const settlementAmount = Number(this.existingExposure.get(['exposure', i, 'settlementAmount']).value);
        const enhanceLimitAmount = Number(this.existingExposure.get(['exposure', i, 'enhanceLimitAmount']).value);
        if (type.toString() === 'settlement') {
            totalLimit = existingLimit - settlementAmount;
        } else {
            totalLimit = existingLimit + enhanceLimitAmount;
        }
        this.existingExposure.get(['exposure', i, 'proposedLimit']).setValue(Number(totalLimit).toFixed(2));
    }

    onSubmit() {
        const existingExposureData = this.existingExposure.get('exposure') as FormArray;
        console.log('existingExposureData', existingExposureData);
        // this.customerInfoService.saveExistingExposure(existingExposureData.value, this.customerInfo.id).subscribe((res: any) => {
        //     console.log('res', res);
        // });
    }

    addProposalData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            const pData = JSON.parse(data.proposal.data);
            return this.formBuilder.group({
                existingLimit: [pData.existingLimit],
                proposedLimit: [pData.proposedLimit, [Validators.required, Validators.min(0)]],
                existInterestRate: [pData.existInterestRate],
                interestRate: [pData.interestRate],
                baseRate: [pData.baseRate],
                premiumRateOnBaseRate: [pData.premiumRateOnBaseRate],
                tenureDurationInMonths: [pData.tenureDurationInMonths],
                outStandingLimit: [pData.outStandingLimit],
                existCashMargin: [pData.existCashMargin],
                cashMargin: [pData.cashMargin],
                existCommissionPercentage: [pData.existCommissionPercentage],
                commissionPercentage: [pData.commissionPercentage],
                enhanceLimitAmount: [pData.enhanceLimitAmount],
                commitmentFee: [pData.commitmentFee],
                settlementAmount: [pData.settlementAmount],
                existingDateOfExpiry: [!ObjectUtil.isEmpty(pData.existingDateOfExpiry) ? new Date(pData.existingDateOfExpiry) : undefined]
            });
        }
    }
}

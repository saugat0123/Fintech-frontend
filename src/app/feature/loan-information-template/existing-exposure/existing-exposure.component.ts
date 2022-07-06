import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerType} from '../../customer/model/customerType';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-existing-exposure',
    templateUrl: './existing-exposure.component.html',
    styleUrls: ['./existing-exposure.component.scss']
})
export class ExistingExposureComponent implements OnInit {
    @Input() customerType: CustomerType;
    @Input() customerInfo: CustomerInfoData;

    existingExposure: FormGroup;
    submitted = false;
    loanList = [];
    selectedLoanList = [];

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private loanFormService: LoanFormService) {
    }

    ngOnInit() {
        console.log('customerInfo', this.customerInfo);
        this.buildForm();
        this.getAllLoanList();
        this.addExposure();
        this.getApprovedLoanList();
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
        // const listOfLoan = [];
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
                proposedLimit: [undefined, [Validators.required, Validators.min(0)]],
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
                existingDateOfExpiry: [undefined]
            })
        );
    }

    private getApprovedLoanList() {
        this.loanFormService.getLoansByLoanHolderIdAndDocStatus(this.customerInfo.id, 'APPROVED')
            .subscribe((res: any) => {
                console.log('res', res);
            });
    }
}

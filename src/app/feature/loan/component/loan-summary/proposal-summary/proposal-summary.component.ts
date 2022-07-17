import {Component, DoCheck, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {Proposal} from '../../../../admin/modal/proposal';
import {DocStatus} from '../../../model/docStatus';
import {LoanType} from '../../../model/loanType';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ActivatedRoute} from '@angular/router';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {CustomerLoanDto} from '../../../model/CustomerLoanDto';
import {ExistingExposure} from '../../../model/existingExposure';

@Component({
    selector: 'app-proposal-summary',
    templateUrl: './proposal-summary.component.html',
    styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit, DoCheck {

    @Input() proposalData: Proposal;
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() loanDataHolder;
    @Input() approveSheet;
    public DocStatus = DocStatus;
    public LoanType = LoanType;
    public EnumUtils = EnumUtils;
    proposalAllData: any;
    customerFundedLoanList: LoanDataHolder[];
    customerNonFundedLoanList: LoanDataHolder[];
    loanType = LoanType;
    checkedData;
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
    allId;
    showInstallmentAmount = false;
    showRepaymentMode = false;
    showPrincipalAmount = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    @Output() eventEmitter = new EventEmitter();
    customerLoanDtoList: CustomerLoanDto[];
    array = [];
    iterableDiffer;
    existingExposure: ExistingExposure[] = [];
    fundedNonFundedAmount = {
        fundedProposedLimit: 0,
        nonFundedProposedLimit: 0,
        fundedExistingLimit: 0,
        nonFundedExistingLimit: 0,
    };

    constructor(private iterableDiffers: IterableDiffers) {
        this.iterableDiffer = iterableDiffers.find([]).create(null);
    }

    ngOnInit() {
        this.proposalAllData = JSON.parse(this.proposalData.data);
        this.checkedData = JSON.parse(this.proposalData.checkedData);
        if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
                this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.existingExposures)) {
                if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.existingExposures.length > 0)) {
                    this.existingExposure = this.loanDataHolder.loanHolder.existingExposures;
                }
            }
        }
        this.calculateInterestRate();
        this.checkInstallmentAmount();
    }

    public getTotal(key: string): number {
        const tempList = this.customerAllLoanList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        let total = tempList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
        // if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
        //     this.customerLoanDtoList.forEach(cdl => {
        //        total += JSON.parse(cdl.proposal.data)[key];
        //     });
        // }
        if (this.existingExposure.length > 0) {
            this.existingExposure.forEach(ee => {
                total += JSON.parse(ee.proposalData)[key];
            });
        }
        return this.isNumber(total);
    }

    public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
        this.fundedAndNonfundedList(loanList);
        let numb;
        if (funded) {
            const tempList = this.customerFundedLoanList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
            // if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
            //     const tempCustomerLoanDtoList = this.customerLoanDtoList
            //         .filter(l => l.isFundable);
            //     tempCustomerLoanDtoList.forEach(cdl => {
            //         numb = numb + JSON.parse(cdl.proposal.data)[key];
            //     });
            // }
            if (this.existingExposure.length > 0) {
                const tempExistingExposureData = this.existingExposure
                    .filter(l => l.loanConfig.isFundable);
                tempExistingExposureData.forEach(e => {
                    numb = numb + JSON.parse(e.proposalData)[key];
                });
            }
            if (key === 'existingLimit') {
                this.fundedNonFundedAmount.fundedExistingLimit = numb;
            }
            if (key === 'proposedLimit') {
                this.fundedNonFundedAmount.fundedProposedLimit = numb;
            }
        } else {
            const tempList = this.customerNonFundedLoanList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
            // if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
            //     const tempCustomerLoanDtoList = this.customerLoanDtoList
            //         .filter(l => !l.isFundable);
            //     tempCustomerLoanDtoList.forEach(cdl => {
            //         numb = numb + JSON.parse(cdl.proposal.data)[key];
            //     });
            // }
            if (this.existingExposure.length > 0) {
                const tempExistingExposureData = this.existingExposure
                    .filter(l => !l.loanConfig.isFundable);
                tempExistingExposureData.forEach(e => {
                    numb = numb + JSON.parse(e.proposalData)[key];
                });
            }
            if (key === 'existingLimit') {
                this.fundedNonFundedAmount.nonFundedExistingLimit = numb;
            }
            if (key === 'proposedLimit') {
                this.fundedNonFundedAmount.nonFundedProposedLimit = numb;
            }
        }
        return this.isNumber(numb);

    }

    fundedAndNonfundedList(loanList: LoanDataHolder[]) {
        this.customerFundedLoanList = loanList.filter((l) => l.loan.isFundable);
        if (ObjectUtil.isEmpty(this.customerFundedLoanList)) {
            this.customerFundedLoanList = [];
        }
        this.customerNonFundedLoanList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
        if (ObjectUtil.isEmpty(this.customerNonFundedLoanList)) {
            this.customerNonFundedLoanList = [];
        }
    }

    isNumber(value) {
        if (ObjectUtil.isEmpty(value)) {
            return 0;
        }
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }

    getLoanConfig() {
        this.customerAllLoanList.forEach(c => {
            const config = {
                isFundable: c.loan.isFundable,
                fundableNonFundableSelcted: !ObjectUtil.isEmpty(c.loan.isFundable),
                isFixedDeposit: c.loan.loanTag === 'FIXED_DEPOSIT',
                isGeneral: c.loan.loanTag === 'GENERAL',
                isShare: c.loan.loanTag === 'SHARE_SECURITY',
                isVehicle: c.loan.loanTag === 'VEHICLE',
                isHomeLoan: c.loan.loanTag === 'HOME_LOAN',
                loanNature: c.loan.loanNature,
                loanNatureSelected: false,
                isTerminating: false,
                isRevolving: false,
            };
            if (!ObjectUtil.isEmpty(config.loanNature)) {
                config.loanNatureSelected = true;
                if (config.loanNature.toString() === 'Terminating') {
                    config.isTerminating = true;
                } else {
                    config.isRevolving = true;
                }
                if (config.isRevolving) {
                    config.isGeneral = false;
                }
            }
            if (!config.isFundable) {
                config.isGeneral = false;
            }
            if (config.isFixedDeposit) {
                config.loanNatureSelected = false;
                config.fundableNonFundableSelcted = false;
            }
            this.array.push(config);
        });
    }

    checkInstallmentAmount() {
        if (this.proposalAllData.repaymentMode === 'EMI' || this.proposalAllData.repaymentMode === 'EQI') {
            this.showInstallmentAmount = true;
        }
        if (this.proposalAllData.repaymentMode === 'CUSTOM') {
            this.showRepaymentMode = true;
        }
        if (this.proposalAllData.repaymentMode === 'AT MATURITY') {
            this.showPrincipalAmount = true;
        }
    }

    calculateInterestRate() {
        const premiumRateOnBaseRate = Number(this.proposalAllData.premiumRateOnBaseRate);
        const baseRate = Number(this.proposalAllData.baseRate);
        const subsidizedRate = Number(this.proposalAllData.subsidizedLoan);
        const interestRate = baseRate + premiumRateOnBaseRate - subsidizedRate;
        return interestRate;
    }

    calculateTotalChangeAmount(loanList: LoanDataHolder[], existingExposure: ExistingExposure[] = []): number {
        const tempList = loanList
            .filter(l => JSON.parse(l.proposal.data).proposedLimit -
                (JSON.parse(l.proposal.data).existingLimit ? JSON.parse(l.proposal.data).existingLimit : 0));
        let total = tempList
            .map(l => JSON.parse(l.proposal.data).proposedLimit -
                (JSON.parse(l.proposal.data).existingLimit ? JSON.parse(l.proposal.data).existingLimit : 0))
            .reduce((a, b) => a + b, 0);
        if (existingExposure.length > 0) {
            existingExposure.forEach(e => {
                const changeAmount = JSON.parse(e.proposalData).proposedLimit - JSON.parse(e.proposalData).existingLimit;
                total += changeAmount;
            });
        }
        return this.isNumber(total);
    }

    calculateChangeInAmount(proposed, existing): number {
        const changeInAmount = Number(proposed) - (existing ? Number(existing) : 0);
        return this.isNumber(changeInAmount);
    }

    ngDoCheck(): void {
        const changes = this.iterableDiffer.diff(this.customerAllLoanList);
        if (changes) {
            this.getLoanConfig();
        }
    }
}

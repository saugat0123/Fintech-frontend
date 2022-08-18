import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {Proposal} from '../../../../admin/modal/proposal';
import {DocStatus} from '../../../model/docStatus';
import {LoanType} from '../../../model/loanType';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {LoanTag} from '../../../model/loanTag';
import {CustomerLoanDto} from '../../../model/customerLoanDto';

@Component({
    selector: 'app-proposal-summary',
    templateUrl: './proposal-summary.component.html',
    styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit {
    @Input() proposalData: Proposal;
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() loanDataHolder: LoanDataHolder;
    @Input() approveSheet;
    public DocStatus = DocStatus;
    public LoanType = LoanType;
    public EnumUtils = EnumUtils;
    proposalAllData: any;
    customerFundedLoanList: LoanDataHolder[];
    customerNonFundedLoanList: LoanDataHolder[];
    loanType: any;
    client = environment.client;
    clientName = Clients;
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
    breakException: any;
    isRemit = false;
    @Output() eventEmitter = new EventEmitter();
    customerLoanDtoList: CustomerLoanDto[];
    consumerFinance = false;

    constructor(private activatedRoute: ActivatedRoute,
                private loanConfigService: LoanConfigService) {
    }
    loanDatas: {
        loanNatureSelected: any, fundableNonFundableSelcted: any, isFundable: any, isTerminating: any,
        isVehicle: any, isShare: any, isGeneral: any, showInstallmentAmount: any, showRepaymentMode: any,
        showPrincipalAmount: any, isFixedDeposit: any, isRevolving: any
    }[] = [];

    ngOnInit() {

        if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
            this.consumerFinance = true;
        }
        if (!ObjectUtil.isEmpty(this.proposalData.data)) {
            this.proposalAllData = JSON.parse(this.proposalData.data);
            this.checkedData = JSON.parse(this.proposalData.checkedData);
            if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
                if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
                    this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
                    this.customerLoanDtoList = this.customerLoanDtoList.filter(l => l.proposal.data !== null);
                }
            }
            this.calculateInterestRate();
            this.getLoanConfig();
            this.checkInstallmentAmount();
        }
        if (this.loanDataHolder) {
            if (this.loanDataHolder.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN) && this.loanDataHolder.loan.isRemit) {
                this.isRemit = true;
            }
        }
        if (this.customerAllLoanList.length > 0) {
            this.setToggled();
        }
    }

    public setToggled() {
        if (!ObjectUtil.isEmpty(this.customerAllLoanList)) {
            this.loanDatas = [];
            this.customerAllLoanList.forEach((d, i) => {
                const loan = d.loan;
                const toggle = {
                    loanNatureSelected: false,
                    fundableNonFundableSelcted: !ObjectUtil.isEmpty(loan.isFundable),
                    isFundable: loan.isFundable,
                    isTerminating: false,
                    isVehicle: loan.loanTag === 'VEHICLE',
                    isShare: loan.loanTag === 'SHARE_SECURITY',
                    isGeneral: loan.loanTag === 'GENERAL',
                    showInstallmentAmount: false,
                    showRepaymentMode: false,
                    showPrincipalAmount: false,
                    isFixedDeposit: loan.loanTag === 'FIXED_DEPOSIT',
                    isRevolving: false
                };
                const proposalData = JSON.parse(d.proposal.data);
                if (proposalData.repaymentMode === 'EMI' || proposalData.repaymentMode === 'EQI') {
                    toggle.showInstallmentAmount = true;
                }
                if (proposalData.repaymentMode === 'CUSTOM') {
                    toggle.showRepaymentMode = true;
                }
                if (proposalData.repaymentMode === 'AT MATURITY') {
                    toggle.showPrincipalAmount = true;
                }
                const loanNature = loan.loanNature;
                if (!ObjectUtil.isEmpty(loanNature)) {
                    toggle.loanNatureSelected = true;
                    toggle.isTerminating = this.loanNature === 'Terminating';
                    toggle.isRevolving = this.loanNature === 'Revolving';
                    if (toggle.isRevolving) {
                        toggle.isGeneral = false;
                    }
                }
                if (!toggle.isFundable) {
                    toggle.isGeneral = false;
                }
                if (toggle.isFixedDeposit) {
                    toggle.loanNatureSelected = false;
                    toggle.fundableNonFundableSelcted = false;
                }
                this.loanDatas.push(toggle);
            });

        }
    }

    public getTotal(key: string): number {
        const filteredList = this.customerAllLoanList.filter(l => l.proposal.data !== null);
        const tempList = filteredList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        let total = tempList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
        if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
            this.customerLoanDtoList.forEach(cdl => {
                if (!ObjectUtil.isEmpty(cdl.proposal.data)) {
                    total += JSON.parse(cdl.proposal.data)[key];
                }
            });
        }
        if (key === 'proposedLimit') {
            let totals = 0;
            this.customerAllLoanList.forEach(d => {
                if (d.withIn) {
                    totals += JSON.parse(d.proposal.data).proposedLimit;
                }
            });
            total = total  - totals;
        }
        return this.isNumber(total);
    }

    public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
        this.fundedAndNonfundedList(loanList);
        let numb;
        if (funded) {
            const filteredList = this.customerFundedLoanList.filter(l => l.proposal.data !== null);
            const tempList = filteredList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
            if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
                const tempCustomerLoanDtoList: CustomerLoanDto[] = this.customerLoanDtoList
                    .filter(l => l.isFundable && l.proposal.data !== null);
                tempCustomerLoanDtoList.forEach(cdl => {
                    // numb = numb + JSON.parse(cdl.proposal.data)[key];
                });
            }
        } else {
            const filteredList = this.customerNonFundedLoanList.filter(l => l.proposal.data !== null);
            const tempList = filteredList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
            if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
                const tempCustomerLoanDtoList = this.customerLoanDtoList
                    .filter(l => !l.isFundable && l.proposal.data !== null);
                tempCustomerLoanDtoList.forEach(cdl => {
                    numb = numb + JSON.parse(cdl.proposal.data)[key];
                });
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
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanConfigId: null
                };
                this.allId = paramsValue;
                this.loanConfigService.detail(this.allId.loanConfigId).subscribe((response: any) => {
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
                });
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

    getWithinLoan(id) {
       return  this.customerAllLoanList.filter(d => d.id === id)[0].loan.name;
    }
}

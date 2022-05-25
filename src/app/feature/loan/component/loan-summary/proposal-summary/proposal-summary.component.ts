import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {SummaryType} from '../../SummaryType';
import {CustomerLoanDto} from '../../../model/CustomerLoanDto';
import {FormBuilder} from '@angular/forms';
import {BOOL_TYPE} from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-proposal-summary',
    templateUrl: './proposal-summary.component.html',
    styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit, OnChanges {
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
    summaryType = environment.summaryType;
    summaryTypeName = SummaryType;
    @Input() loanCategory;
    customerLoanDtoList: CustomerLoanDto[];
    array = [];
    dtoArray = [];
    PROPOSED_FILTER_KEY = 'proposedLimit';

    constructor(private activatedRoute: ActivatedRoute,
                private loanConfigService: LoanConfigService) {
    }

    ngOnInit() {
    }

    public getTotal(key: string): number {
        const tempList = this.customerAllLoanList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        let total = 0;
        if (key === 'proposedLimit') {
            total = tempList
                .filter(data => data.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && data.loanType.toString() !== 'CLOSURE_LOAN')
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
        } else {
            total = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
        }
        if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
            this.customerLoanDtoList.forEach(cdl => {
                if (key === this.PROPOSED_FILTER_KEY) {
                    if (cdl.loanType.toString() === 'FULL_SETTLEMENT_LOAN' || cdl.loanType.toString() === 'CLOSURE_LOAN') {
                        return this.isNumber(total);
                    }
                }
               total += !ObjectUtil.isEmpty(JSON.parse(cdl.proposal.data)[key]) ?
                   JSON.parse(cdl.proposal.data)[key] : 0;
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
            if (key === this.PROPOSED_FILTER_KEY) {
                numb = tempList
                    .filter(data => data.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && data.loanType.toString() !== 'CLOSURE_LOAN')
                    .map(l => JSON.parse(l.proposal.data)[key])
                    .reduce((a, b) => a + b, 0);
            } else {
                numb = tempList
                    .map(l => JSON.parse(l.proposal.data)[key])
                    .reduce((a, b) => a + b, 0);
            }
            if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
                let tempCustomerLoanDtoList = [];
                this.customerLoanDtoList.forEach(l => {
                    if (!ObjectUtil.isEmpty(l.loanConfig)) {
                        tempCustomerLoanDtoList = this.customerLoanDtoList.filter(l1 => l1.loanConfig.isFundable);
                    } else {
                        tempCustomerLoanDtoList = this.customerLoanDtoList.filter(l1 => l1.isFundable);
                    }
                });
                tempCustomerLoanDtoList.forEach(cdl => {
                    if (key === this.PROPOSED_FILTER_KEY) {
                        if (cdl.loanType.toString() === 'FULL_SETTLEMENT_LOAN' || cdl.loanType.toString() === 'CLOSURE_LOAN') {
                            return this.isNumber(numb);
                        }
                    }
                    numb += !ObjectUtil.isEmpty(JSON.parse(cdl.proposal.data)[key]) ?
                        JSON.parse(cdl.proposal.data)[key] : 0;
                });
            }
        } else {
            const tempList = this.customerNonFundedLoanList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            if (key === this.PROPOSED_FILTER_KEY) {
                numb = tempList
                    .filter(data => data.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && data.loanType.toString() !== 'CLOSURE_LOAN')
                    .map(l => JSON.parse(l.proposal.data)[key])
                    .reduce((a, b) => a + b, 0);
            } else {
                numb = tempList
                    .map(l => JSON.parse(l.proposal.data)[key])
                    .reduce((a, b) => a + b, 0);
            }
            if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
                let tempCustomerLoanDtoList = [];
                this.customerLoanDtoList.forEach(l => {
                    if (!ObjectUtil.isEmpty(l.loanConfig)) {
                        tempCustomerLoanDtoList = this.customerLoanDtoList.filter(l1 => !l1.loanConfig.isFundable);
                    } else {
                        tempCustomerLoanDtoList = this.customerLoanDtoList.filter(l1 => !l1.isFundable);
                    }
                });
                tempCustomerLoanDtoList.forEach(cdl => {
                    if (key === this.PROPOSED_FILTER_KEY) {
                        if (cdl.loanType.toString() === 'FULL_SETTLEMENT_LOAN' || cdl.loanType.toString() === 'CLOSURE_LOAN') {
                            return this.isNumber(numb);
                        }
                    }
                    numb += !ObjectUtil.isEmpty(JSON.parse(cdl.proposal.data)[key]) ?
                        JSON.parse(cdl.proposal.data)[key] : 0;
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
        return interestRate.toFixed(2);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.proposalAllData = JSON.parse(this.proposalData.data);
        this.checkedData = JSON.parse(this.proposalData.checkedData);
        if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
                this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
            }
        }
        this.calculateInterestRate();
        this.getLoanConfig();
        this.checkInstallmentAmount();
        this.loanConfig();
    }

    private loanConfig() {
        this.customerAllLoanList.forEach(c => {
            const config = {
                isFundable: c.loan.isFundable,
                fundableNonFundableSelcted: !ObjectUtil.isEmpty(c.loan.isFundable),
                isFixedDeposit: c.loan.loanTag === 'FIXED_DEPOSIT',
                isGeneral: c.loan.loanTag === 'GENERAL',
                isShare: c.loan.loanTag === 'SHARE_SECURITY',
                isVehicle: c.loan.loanTag === 'VEHICLE',
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
        if (!ObjectUtil.isEmpty(this.customerLoanDtoList)) {
            this.customerLoanDtoList.forEach(cd => {
                let dtoCfonfig;
                if (!ObjectUtil.isEmpty(cd.loanConfig)) {
                    dtoCfonfig = {
                        isFundable: cd.loanConfig.isFundable,
                        fundableNonFundableSelcted: !ObjectUtil.isEmpty(cd.loanConfig.isFundable),
                        isFixedDeposit: cd.loanConfig.loanTag === 'FIXED_DEPOSIT',
                        isGeneral: cd.loanConfig.loanTag === 'GENERAL',
                        isShare: cd.loanConfig.loanTag === 'SHARE_SECURITY',
                        isVehicle: cd.loanConfig.loanTag === 'VEHICLE',
                        loanNature: cd.loanConfig.loanNature,
                        loanNatureSelected: false,
                        isTerminating: false,
                        isRevolving: false,
                    };
                }
                if (!ObjectUtil.isEmpty(dtoCfonfig)) {
                    if (!ObjectUtil.isEmpty(dtoCfonfig.loanNature)) {
                        dtoCfonfig.loanNatureSelected = true;
                        if (dtoCfonfig.loanNature.toString() === 'Terminating') {
                            dtoCfonfig.isTerminating = true;
                        } else {
                            dtoCfonfig.isRevolving = true;
                        }
                        if (dtoCfonfig.isRevolving) {
                            dtoCfonfig.isGeneral = false;
                        }
                    }
                    if (!dtoCfonfig.isFundable) {
                        dtoCfonfig.isGeneral = false;
                    }
                    if (dtoCfonfig.isFixedDeposit) {
                        dtoCfonfig.loanNatureSelected = false;
                        dtoCfonfig.fundableNonFundableSelcted = false;
                    }
                }
                this.dtoArray.push(dtoCfonfig);
            });
        }
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {Proposal} from '../../../../admin/modal/proposal';
import {DocStatus} from '../../../model/docStatus';
import {LoanType} from '../../../model/loanType';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-proposal-summary',
    templateUrl: './proposal-summary.component.html',
    styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit {
    @Input() proposalData: Proposal;
    @Input() customerAllLoanList: LoanDataHolder[];
    public DocStatus = DocStatus;
    public LoanType = LoanType;
    public EnumUtils = EnumUtils;
    proposalAllData: any;
    customerFundedLoanList: LoanDataHolder[];
    customerNonFundedLoanList: LoanDataHolder[];


    constructor() {
    }

    ngOnInit() {
        this.proposalAllData = JSON.parse(this.proposalData.data);
    }

    public getTotal(key: string): number {
        const total = this.customerAllLoanList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
        return this.isNumber(total);
    }

    public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
        this.fundedAndNonfundedList(loanList);
        let numb;
        if (funded) {
            numb = this.customerFundedLoanList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
        } else {
            numb = this.customerNonFundedLoanList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
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
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }

}

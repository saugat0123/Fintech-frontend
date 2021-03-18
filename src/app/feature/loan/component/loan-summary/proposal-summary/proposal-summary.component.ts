import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {Proposal} from '../../../../admin/modal/proposal';
import {DocStatus} from '../../../model/docStatus';
import {LoanType} from '../../../model/loanType';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';

@Component({
    selector: 'app-proposal-summary',
    templateUrl: './proposal-summary.component.html',
    styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit {
    @Input() proposalData: Proposal;
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() loanDataHolder;
    public DocStatus = DocStatus;
    public LoanType = LoanType;
    public EnumUtils = EnumUtils;
    proposalAllData: any;
    customerFundedLoanList: LoanDataHolder[];
    customerNonFundedLoanList: LoanDataHolder[];
    loanType: any;

    constructor() {
    }

    ngOnInit() {
        this.proposalAllData = JSON.parse(this.proposalData.data);
        if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
            this.loanType = this.loanDataHolder.loanType;
        }
    }

    public getTotal(key: string): number {
        const tempList = this.customerAllLoanList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        const total = tempList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
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
        } else {
            const tempList = this.customerNonFundedLoanList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
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
        if (ObjectUtil.isEmpty(value)) {
            return 0;
        }
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }


}

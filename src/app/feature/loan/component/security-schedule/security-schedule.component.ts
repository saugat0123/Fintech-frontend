import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../admin/modal/proposal';
import {Security} from '../../model/security';
import {LoanDataHolder} from '../../model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-security-schedule',
    templateUrl: './security-schedule.component.html',
    styleUrls: ['./security-schedule.component.scss']
})
export class SecurityScheduleComponent implements OnInit {

    constructor() {
    }

    @Input() loanDataHolder: LoanDataHolder;
    @Input() customerAllLoanList: LoanDataHolder[];
    securityData: Security;
    files;
    fixedAssets: number;
    proposal: Proposal;
    loanToSecurity: number;
    totalSecurity = 0;
    totalProposedLimit = 0;

    ngOnInit() {
        this.proposal = this.loanDataHolder.proposal;
        if (!ObjectUtil.isEmpty(this.proposal.data)) {
            if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
                this.files = JSON.parse(JSON.parse(this.proposal.data).files);
            }
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.securities) && !ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
            if (!ObjectUtil.isEmpty(this.loanDataHolder.combinedLoan)) {
                this.customerAllLoanList.forEach((d) => {
                    if(d.combinedLoan && (d.documentStatus.toString() === 'UNDER_REVIEW' || d.documentStatus.toString() === 'PENDING' || d.documentStatus.toString() === 'HSOV_PENDING' || d.documentStatus.toString() === 'DUAL_APPROVAL_PENDING')) {
                    this.totalProposedLimit += d.proposal.proposedLimit;
                    }
                    d.securityLoanReferences.forEach((s) => {
                        this.totalSecurity += s.usedAmount;
                    });
                });
                this.loanToSecurity = (this.totalProposedLimit / this.totalSecurity);
            } else {
                this.loanDataHolder.securityLoanReferences.forEach((d) => {
                    this.totalSecurity += d.usedAmount;
                });
                this.totalProposedLimit = this.loanDataHolder.proposal.proposedLimit;
                this.loanToSecurity = (this.totalProposedLimit / this.totalSecurity);
            }
            this.fixedAssets = this.totalSecurity - Number(this.totalProposedLimit);
            if (this.fixedAssets < 0) {
                this.fixedAssets = Math.abs(this.fixedAssets);
            } else {
                this.fixedAssets = 0;
            }
        }
    }
}


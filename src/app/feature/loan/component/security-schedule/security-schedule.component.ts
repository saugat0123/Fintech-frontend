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
    @Input() loanSecurity: Array<Security> = [];
    @Input() approvedSecurity: Array<Security> = [];
    securityData: Security;
    files;
    fixedAssets: number;
    proposal: Proposal;
    loanToSecurity: number;
    totalSecurity = 0;
    totalProposedLimit = 0;
    totalSecurities: Array<Security> = [];

    ngOnInit() {
        this.proposal = this.loanDataHolder.proposal;
        if (!ObjectUtil.isEmpty(this.proposal.data)) {
            if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
                this.files = JSON.parse(JSON.parse(this.proposal.data).files);
            }
        }
        this.totalSecurities = this.totalSecurities.concat(this.approvedSecurity);
        this.totalSecurities = this.totalSecurities.concat(this.loanSecurity);
        this.customerAllLoanList.forEach((d) => {
            this.totalProposedLimit += JSON.parse(d.proposal.data).proposedLimit;
        });
        if (this.totalSecurities.length > 0) {
            const proposedSecurity = this.totalSecurities.map(d => d.id);
            this.totalSecurities =  this.totalSecurities
                .filter((value, index) => proposedSecurity.indexOf(value.id) === index);
            this.totalSecurities.forEach((d) => {
                this.totalSecurity += d.fairMarketValue;
            });
        }
        this.fixedAssets = this.totalSecurity - Number(this.totalProposedLimit);
            if (this.fixedAssets < 0) {
                this.fixedAssets = Math.abs(this.fixedAssets);
            } else {
                this.fixedAssets = 0;
            }
        }
}


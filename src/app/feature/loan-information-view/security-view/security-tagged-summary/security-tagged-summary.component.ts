import {Component, Input, OnInit} from '@angular/core';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';
import {LoanDataHolder} from '../../../loan/model/loanData';

@Component({
    selector: 'app-security-tagged-summary',
    templateUrl: './security-tagged-summary.component.html',
    styleUrls: ['./security-tagged-summary.component.scss']
})
export class SecurityTaggedSummaryComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
    spinner = false;
    allSecurity;
    securityDetails;
    loaded = false;

    constructor(private securityLoanReferenceService: SecurityLoanReferenceService) {
    }

    ngOnInit() {
        this.getSecurityDetails(this.loanDataHolder.id);
    }

  setCoverage() {
    this.securityDetails.forEach((d, i) => {
      this.allSecurity.forEach((dd, ii) => {
        if (d.securityId === dd.id) {
          this.allSecurity[ii].coverage = d.coverage;
          this.allSecurity[ii].usedAmount = d.usedAmount;
        }
      });
    });
    this.loaded = true;
  }

    private getSecurityDetails(id): void {
        this.spinner = true;
        this.securityLoanReferenceService.getAllSecurityLoanReferencesByLoanId(Number(id)).subscribe(res => {
            this.spinner = false;
            this.securityDetails = res.detail;
            this.allSecurity = this.loanDataHolder.securities;
            this.setCoverage();
        }, (err) => {
            this.spinner = false;
        });
    }
}

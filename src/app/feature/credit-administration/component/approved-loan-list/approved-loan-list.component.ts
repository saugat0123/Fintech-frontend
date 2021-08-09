import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Router} from '@angular/router';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approved-loan-list',
  templateUrl: './approved-loan-list.component.html',
  styleUrls: ['./approved-loan-list.component.scss']
})
export class ApprovedLoanListComponent implements OnInit {
  @Input()
  customerLoanList: Array<LoanDataHolder>;

  constructor(private router: Router, public modalService: NgbActiveModal) {
  }

  ngOnInit() {
  }

  routeToLoanSummary(loanConfigId: number, customerId: number) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId,
        catalogue: true
      }
    });
  }

  public getTotal(key: string, loanList: LoanDataHolder[]): number {
    return this.isNumber(loanList
    .map(l => (l.proposal.proposedLimit))
    .reduce((a, b) => a + b, 0));

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

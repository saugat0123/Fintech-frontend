import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';


@Component({
  selector: 'app-pending-loan',
  templateUrl: './pending-loan.component.html',
  styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  closedCount: number;
  notifyCount: number;
  roleName: string;
  currentUserIsCEO: boolean;

  constructor(
      private router: Router,
      private loanFormService: LoanFormService
  ) {
  }

  ngOnInit() {
    this.roleName = localStorage.getItem('roleName').toLowerCase();
    this.currentUserIsCEO = this.roleName === 'ceo' || this.roleName === 'chief executive officer';
    this.loanFormService.getStatus().subscribe(
        (response: any) => {
          this.pendingCount = response.detail.pending;
          this.approvedCount = response.detail.Approved;
          this.rejectedCount = response.detail.Rejected;
          this.closedCount = response.detail.Closed;
          this.notifyCount = response.detail.notify;
        }
    );
  }
}

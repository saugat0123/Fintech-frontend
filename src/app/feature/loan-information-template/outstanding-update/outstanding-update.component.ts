import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {DocStatus} from '../../loan/model/docStatus';

@Component({
  selector: 'app-outstanding-update',
  templateUrl: './outstanding-update.component.html',
  styleUrls: ['./outstanding-update.component.scss']
})
export class OutstandingUpdateComponent implements OnInit {
  approvedLoans = [];
  constructor(
      private activatedRoute: ActivatedRoute,
      private customerLoanService: LoanFormService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.customerLoanService.getFinalLoanListByLoanHolderId(res.customerInfoId).subscribe((response: any) => {
        console.log('response: ', response)
        this.approvedLoans = response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);

      });
    });
  }

}

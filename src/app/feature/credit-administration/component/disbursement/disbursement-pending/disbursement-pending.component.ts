import { Component, OnInit } from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';

@Component({
  selector: 'app-disbursement-pending',
  templateUrl: './disbursement-pending.component.html',
  styleUrls: ['./disbursement-pending.component.scss']
})
export class DisbursementPendingComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'DISBURSEMENT_PENDING'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;


  constructor(private service: CreditAdministrationService,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: DisbursementPendingComponent) {
    other.spinner = true;
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
      other.loanList = res.detail.content;
      console.log(other.loanList);
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.spinner = false;

    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    DisbursementPendingComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    DisbursementPendingComponent.loadData(this);
  }

  loadProfile(cadDocumentId) {
    this.router.navigate(['/home/credit/offer-letter-profile'],
        {
          queryParams: {
            cadDocumentId: cadDocumentId,
          }
        });
  }
}

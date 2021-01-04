import { Component, OnInit } from '@angular/core';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../../loan/model/loanType';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-offer-letter-list',
  templateUrl: './offer-letter-list.component.html',
  styleUrls: ['./offer-letter-list.component.scss']
})
export class OfferLetterListComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private spinnerService: NgxSpinnerService) { }

  static loadData(other: OfferLetterListComponent) {
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
    OfferLetterListComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    OfferLetterListComponent.loadData(this);
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

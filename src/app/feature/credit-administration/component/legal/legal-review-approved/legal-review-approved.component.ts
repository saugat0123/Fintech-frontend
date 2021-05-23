import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';

@Component({
  selector: 'app-legal-review-approved',
  templateUrl: './legal-review-approved.component.html',
  styleUrls: ['./legal-review-approved.component.scss']
})
export class LegalReviewApprovedComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'LEGAL_APPROVED'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;


  constructor(private service: CreditAdministrationService,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: LegalReviewApprovedComponent) {
    other.spinner = true;
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      console.log(other.loanList);
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.spinner = false;

    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    LegalReviewApprovedComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    LegalReviewApprovedComponent.loadData(this);
  }

  loadProfile(cadDocumentId) {
    this.router.navigate(['/home/credit/offer-letter-profile'],
        {
          queryParams: {
            cadDocumentId: cadDocumentId,
          }
        });
  }
  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'LEGAL_APPROVED'});
    LegalReviewApprovedComponent.loadData(this);
  }
}

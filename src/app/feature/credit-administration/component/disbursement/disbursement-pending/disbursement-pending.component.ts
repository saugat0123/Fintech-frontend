import { Component, OnInit } from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../../utils/router-utils.service';

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
  toggleArray: { toggled: boolean }[] = [];
  encryptUrlArray: { url: string }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private routeService: RouterUtilsService,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: DisbursementPendingComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: l.previousList.length}));

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

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }

  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'DISBURSEMENT_PENDING'});
    DisbursementPendingComponent.loadData(this);
  }
}

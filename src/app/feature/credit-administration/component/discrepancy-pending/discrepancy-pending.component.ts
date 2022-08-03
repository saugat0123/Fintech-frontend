import { Component, OnInit } from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-discrepancy-pending',
  templateUrl: './discrepancy-pending.component.html',
  styleUrls: ['./discrepancy-pending.component.scss']
})
export class DiscrepancyPendingComponent implements OnInit {


  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'DISCREPANCY_PENDING'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  toggleArray: { toggled: boolean }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];
  partialDiscrepancy = false;

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private routeService: RouterUtilsService,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: DiscrepancyPendingComponent) {
    const url =  other.router.url.split('/');
    other.partialDiscrepancy = url[url.length - 1] === 'partial-discrepancy-pending';
    other.searchObj.docStatus = other.partialDiscrepancy ? 'PARTIAL_DISCREPANCY_PENDING' : 'DISCREPANCY_PENDING';
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
      console.log(other.loanList);
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.spinner = false;

    }, error => {
      other.spinner = false;
      console.log(error);
    });
  }

  ngOnInit() {
    DiscrepancyPendingComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    DiscrepancyPendingComponent.loadData(this);
  }

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }


  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: this.partialDiscrepancy ? 'PARTIAL_DISCREPANCY_PENDING' : 'DISCREPANCY_PENDING'});
    DiscrepancyPendingComponent.loadData(this);
  }

}

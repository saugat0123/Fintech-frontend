import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {NbDialogService} from '@nebular/theme';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-unassigned-loan',
  templateUrl: './unassigned-loan.component.html',
  styleUrls: ['./unassigned-loan.component.scss']
})
export class UnassignedLoanComponent implements OnInit {
  searchObj = {};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  toggleArray: { toggled: boolean }[] = [];

  constructor(private service: CreditAdministrationService,
              private spinnerService: NgxSpinnerService,
              private nbModalService: NbDialogService,
              private modalService: NgbModal,
              public routerUtils: RouterUtilsService) {
  }

  static loadData(other: UnassignedLoanComponent) {
   // other.spinnerService.show();
    other.spinner = true;
    other.toggleArray = [];
    other.loanList = [];
    other.service.getPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
    //  other.spinnerService.hide();
      other.spinner = false;

    }, error => {
     // other.spinnerService.hide();
      other.spinner = false;
    });
  }

  ngOnInit() {
    UnassignedLoanComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    UnassignedLoanComponent.loadData(this);
  }

  openAssignPopUp(data: CustomerApprovedLoanCadDocumentation) {
    const comp = this.modalService.open(AssignPopUpComponent);
    comp.componentInstance.cadData = data;
  }

  setSearchValue(value) {
    this.searchObj = value;
    UnassignedLoanComponent.loadData(this);
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

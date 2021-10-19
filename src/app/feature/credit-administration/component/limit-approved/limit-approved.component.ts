import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {LoanType} from '../../../loan/model/loanType';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {UserService} from '../../../../@core/service/user.service';
import {User} from '../../../admin/modal/user';
import {RoleType} from '../../../admin/modal/roleType';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-limit-approved',
  templateUrl: './limit-approved.component.html',
  styleUrls: ['./limit-approved.component.scss']
})
export class LimitApprovedComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'LIMIT_APPROVED'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  toggleArray: { toggled: boolean }[] = [];
  encryptUrlArray: { url: string }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];

  user: User = new User();
  roleType = RoleType;

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private routeService: RouterUtilsService,
              private userService: UserService,
              private modalService: NgbModal,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: LimitApprovedComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      console.log('response of limit pending', res.detail);
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
    this.userDetail();
    LimitApprovedComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    LimitApprovedComponent.loadData(this);
  }

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }

  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'DISBURSEMENT_PENDING'});
    LimitApprovedComponent.loadData(this);
  }

  userDetail() {
    this.userService.getLoggedInUser().subscribe((res: any) => {
      this.user = res.detail;
    });
  }

  openAssignPopUp(data: CustomerApprovedLoanCadDocumentation) {
    const comp = this.modalService.open(AssignPopUpComponent);
    const dataCad = {
      cadId: data.id,
      branch: data.loanHolder.branch,
      associateId: data.loanHolder.associateId,
      id: data.loanHolder.id,
      customerType: data.loanHolder.customerType,
      idNumber: data.loanHolder.idNumber,
      idRegDate: data.loanHolder.idRegDate,
      idRegPlace: data.loanHolder.idRegPlace,
      name: data.loanHolder.customerType,
      customerLoanDtoList: data.assignedLoan
    };
    comp.componentInstance.cadData = dataCad;
    comp.componentInstance.disbursementDataAssign = true;
    comp.result.then(() => {
      LimitApprovedComponent.loadData(this);
      console.log('When exposure closes');
    }, () => {
      LimitApprovedComponent.loadData(this);
    });
  }

}

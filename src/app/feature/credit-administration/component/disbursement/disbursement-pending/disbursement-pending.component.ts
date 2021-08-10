import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {UserService} from '../../../../../@core/service/user.service';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {AssignPopUpComponent} from '../../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ExposureViewComponent} from '../../../cad-view/exposure-view/exposure-view.component';
import {DisbursementModalComponent} from './disbursement-modal/disbursement-modal.component';

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

  user: User = new User();
  roleType = RoleType;
  asc = false;
  constructor(private service: CreditAdministrationService,
              private router: Router,
              public routeService: RouterUtilsService,
              private userService: UserService,
              private modalService: NgbModal,
              private spinnerService: NgxSpinnerService) {
  }

  static loadData(other: DisbursementPendingComponent) {
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
    this.userDetail();
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
      DisbursementPendingComponent.loadData(this);
      console.log('When exposure closes');
    }, () => {
      DisbursementPendingComponent.loadData(this);
    });
  }

  openDisbursementDetail(id: number) {
    const modelRef =  this.modalService.open(DisbursementModalComponent, { size: 'lg', backdrop: 'static' });
    modelRef.componentInstance.id = id;
    modelRef.componentInstance.displayHistory = true;
    modelRef.componentInstance.fromScc = false;
  }
  sortFilter(sortBy, dir) {
    this.searchObj = Object.assign(this.searchObj, {docStatus: 'DISBURSEMENT_PENDING', sortBy: sortBy, sortOrder: dir});
    DisbursementPendingComponent.loadData(this);
  }
}

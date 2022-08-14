import { Component, OnInit } from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {User} from '../../../admin/modal/user';
import {RoleType} from '../../../admin/modal/roleType';
import {UserService} from '../../../../@core/service/user.service';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  toggleArray: { toggled: boolean, files: any, fileToggled: boolean}[] = [];
  currentIndexArray: { currentIndex: number }[] = [];
  docStatus = 'DISCREPANCY_PENDING';
  user: User = new User();
  roleType = RoleType;
  constructor(private service: CreditAdministrationService,
              private router: Router,
              private routeService: RouterUtilsService,
              private spinnerService: NgxSpinnerService,
              private userService: UserService, private modalService: NgbModal) {
  }

  static loadData(other: DiscrepancyPendingComponent) {
    const url =  other.router.url.split('/');
    other.docStatus = url[url.length - 1];
    other.searchObj.docStatus = other.docStatus;
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.loanList.forEach((d) => {
        const data = [];
        d.cadFileList.forEach((r) => {
          if (r.remarks === 'DEFERRAL') {
            data.push(r.cadDocument.displayName);
          }
        });
        d.additionalDocumentList.forEach((r) => {
          if (r.remarks === 'DEFERRAL') {
            data.push(r.docName);
          }
        });
        other.toggleArray.push({toggled: false, files: data, fileToggled: false});
      });
      other.userDetail();
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
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
    this.searchObj = Object.assign(value, {docStatus: this.docStatus ? 'PARTIAL_DISCREPANCY_PENDING' : 'DISCREPANCY_PENDING'});
    DiscrepancyPendingComponent.loadData(this);
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
      customerLoanDtoList: data.assignedLoan,
      discrepancy: data.discrepancy
    };
    comp.componentInstance.cadData = dataCad;
    comp.componentInstance.disbursementDataAssign = true;
    comp.result.then(() => {
      DiscrepancyPendingComponent.loadData(this);
    }, () => {
      DiscrepancyPendingComponent.loadData(this);
    });
  }


}
import {Component, OnInit} from '@angular/core';
// import {CreditAdministrationService} from '../../../service/credit-administration.service';
// import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
// import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
// import {LoanType} from '../../../../loan/model/loanType';
import {Router} from '@angular/router';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {RoleType} from '../../../admin/modal/roleType';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {UserService} from '../../../../@core/service/user.service';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {User} from '../../../admin/modal/user';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {CadDocStatus} from '../../model/CadDocStatus';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanType} from '../../../loan/model/loanType';
import {Stage} from '../../../loan/model/stage';
import {ApprovalRoleHierarchy} from '../../../loan/approval/ApprovalRoleHierarchy';
import {DocAction} from '../../../loan/model/docAction';
// import {RouterUtilsService} from '../../../utils/router-utils.service';
// import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
// import {User} from '../../../../admin/modal/user';
// import {RoleType} from '../../../../admin/modal/roleType';
// import {UserService} from '../../../../../@core/service/user.service';
// import {Stage} from '../../../../loan/model/stage';
// import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
// import {ApprovalRoleHierarchy} from '../../../../loan/approval/ApprovalRoleHierarchy';

@Component({
  selector: 'app-cad-pull',
  templateUrl: './cad-pull.component.html',
  styleUrls: ['./cad-pull.component.scss']
})
export class CadPullComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
  toggleArray: { toggled: boolean }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];
  user: User = new User();
  roleType = RoleType;
  pullValues: any;
  asc = false;
  searchObj = {
    isPULL: 'true'
  };

  defaultCommunityUser;

  // static defaultCommunityUser;
  formAction: FormGroup;

  constructor(private cadService: CreditAdministrationService,
              private router: Router,
              private modalService: NgbModal,
              private loanFormService: LoanFormService,
              private userService: UserService,
              public routeService: RouterUtilsService,
              public toastService: ToastService,
  ) {
  }

  static async loadData(other: CadPullComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    // await other.userService.getDefaultCommunityUser().then(res => {
    //     this.defaultCommunityUser = res.detail.id;
    // });
    other.searchObj = {
      isPULL: 'true'
    };
    other.cadService.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.spinner = false;
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      other.loanList.forEach((l) => l.loanStage = other.getInitiator(l.assignedLoan));
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
      other.pageable = PaginationUtils.getPageable(res.detail);

    }, error => {
      other.spinner = false;
      console.log(error);
    });
  }

  ngOnInit() {
    this.userDetail();
    if (LocalStorageUtil.getStorage().roleType === RoleType.CAD_ADMIN) {
      this.setDefaultCADROLE();
    } else {
      CadPullComponent.loadData(this);
    }
  }

  changePage(page: number) {
    this.page = page;
    CadPullComponent.loadData(this);
  }

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }


  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'OFFER_PENDING'});
    CadPullComponent.loadData(this);
  }

  userDetail() {
    this.userService.getLoggedInUser().subscribe((res: any) => {
      this.user = res.detail;
    });
  }


  /**
   *  last modified is of approved date
   */
  public getInitiator(loan: any) {
    let stage = new Stage();
    if (!ObjectUtil.isEmpty(loan)) {
      if (loan.length > 1) {
        const commentLoan = loan[loan.length - 1];
        if (ObjectUtil.isEmpty(commentLoan.previousList)) {
          const tempPreviousList = JSON.parse(commentLoan.previousStageList);
          stage = tempPreviousList[0];
        } else {
          stage = commentLoan.previousList[0];
        }
        stage.lastModifiedAt = commentLoan.lastModifiedAt;
        return stage;
      } else if (loan.length === 1) {
        if (ObjectUtil.isEmpty(loan[0].previousList)) {
          const tempPreviousList = JSON.parse(loan[0].previousStageList);
          stage = tempPreviousList[0];
        } else {
          stage = loan[0].previousList[0];
        }

        stage.lastModifiedAt = loan[0].lastModifiedAt;
        return stage;
      }
    }
  }

  sortFilter(sortBy, dir) {
    this.searchObj = Object.assign(this.searchObj, {docStatus: 'OFFER_PENDING', sortBy: sortBy, sortOrder: dir});
    CadPullComponent.loadData(this);
  }

  setDefaultCADROLE() {
    this.spinner = true;
    this.cadService.getRoleInCad().subscribe((res: any) => {
      const roleListInCAD = res.detail;
      const role: ApprovalRoleHierarchy = roleListInCAD.filter(c => c.role.roleName === 'CAD')[0];
      this.searchObj = Object.assign(this.searchObj, {docStatus: 'OFFER_PENDING', toRole: role.role.id});
      CadPullComponent.loadData(this);
      this.spinner = false;

    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }

  onPullClick(template, customerLoanId, userId, loanList) {
    this.pullValues = {
      cadId: customerLoanId,
      docAction: DocAction.value(DocAction.PULLED),
      documentStatus: CadDocStatus.OFFER_AND_LEGAL_PENDING,
      comment: 'PULLED',
      toUser: LocalStorageUtil.getStorage().user,
      toRole: LocalStorageUtil.getStorage().role,
      customerLoanDtoList: loanList
    };
    this.modalService.open(template);
  }

  onClose() {
    this.modalService.dismissAll();
  }

  confirm() {
    this.onClose();
    this.cadService.assignLoanToUser(this.pullValues).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
          this.formAction.get('docAction').value));

      CadPullComponent.loadData(this);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

    });
  }
}

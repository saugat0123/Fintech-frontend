import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../../loan/model/loanType';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {UserService} from '../../../../../@core/service/user.service';
import {Stage} from '../../../../loan/model/stage';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ApprovalRoleHierarchy} from '../../../../loan/approval/ApprovalRoleHierarchy';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from '../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {CadOneformService} from '../../../service/cad-oneform.service';
import {CustomerType} from '../../../../customer/model/customerType';

@Component({
  selector: 'app-doc-check-pending',
  templateUrl: './doc-check-pending.component.html',
  styleUrls: ['./doc-check-pending.component.scss']
})
export class DocCheckPendingComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'DOC_CHECK_PENDING'};
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
  asc = false;

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private userService: UserService,
              public routeService: RouterUtilsService,
              private spinnerService: NgxSpinnerService,
              private dialogService: NbDialogService,
              private cadOneFormService: CadOneformService) {
  }

  static async loadData(other: DocCheckPendingComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    // await other.userService.getDefaultCommunityUser().then(res => {
    //   this.defaultCommunityUser = res.detail.id;
    // });
    other.searchObj = {
      docStatus: 'DOC_CHECK_PENDING',
    };
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.spinner = false;
      console.log(res.detail);
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      // other.loanList.forEach((l) => l.loanStage = other.getInitiator(l.assignedLoan));
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
      other.pageable = PaginationUtils.getPageable(res.detail);

    }, error => {
      other.spinner = false;
      console.log(error);
    });
  }

  ngOnInit() {
    // this.cadOneFormService.getCustomerInfo(10056).subscribe( resp => {
    //   console.log(resp.detail);
    // });
    this.userDetail();
    if (LocalStorageUtil.getStorage().roleType === RoleType.CAD_ADMIN) {
      this.setDefaultCADROLE();
    } else {
      DocCheckPendingComponent.loadData(this);
    }
  }

  changePage(page: number) {
    this.page = page;
    DocCheckPendingComponent.loadData(this);
  }

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }


  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'OFFER_PENDING'});
    DocCheckPendingComponent.loadData(this);
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
    DocCheckPendingComponent.loadData(this);
  }

  setDefaultCADROLE() {
    this.spinner = true;
    this.service.getRoleInCad().subscribe((res: any) => {
      const roleListInCAD = res.detail;
      const role: ApprovalRoleHierarchy = roleListInCAD.filter(c => c.role.roleName === 'CAD')[0];
      this.searchObj = Object.assign(this.searchObj, {docStatus: 'OFFER_PENDING', toRole: role.role.id});
      DocCheckPendingComponent.loadData(this);
      this.spinner = false;

    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }

  onEdit(id: any) {
    this.cadOneFormService.getCustomerInfo(id).subscribe(resp => {
      console.log(resp);
      this.dialogService.open(CadOfferLetterConfigurationComponent, {
        context: {
          customerType: resp.detail.customerType === 'individual' ? CustomerType.INDIVIDUAL : CustomerType.INSTITUTION,
          customerInfo: resp.detail.customerType === 'individual' ? resp.detail.customerInfo : resp.detail.companyInfo,
          loanHolder: resp.detail.loanHolder,
          oneFormCustomer: resp.detail.customerType === 'individual' ? resp.detail.customerInfo : resp.detail.companyInfo,
          actionType: 'Edit',
          activeLoanTab: true,
          customerSubType: resp.detail.loanHolder.customerSubType
        },
        hasBackdrop: false,
        dialogClass: 'model-full',
      });
    });

  }
}

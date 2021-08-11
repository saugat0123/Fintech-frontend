import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {RouteConst} from '../model/RouteConst';
import * as CryptoJS from 'crypto-js';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {UserService} from '../../admin/component/user/user.service';
import {User} from '../../admin/modal/user';
import {CustomerType} from '../../customer/model/customerType';
import {RoleType} from '../../admin/modal/roleType';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {CommonService} from '../../../@core/service/common.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApprovedLoanListComponent} from '../component/approved-loan-list/approved-loan-list.component';
import {PreviewCadComponent} from '../component/preview-cad/preview-cad.component';

@Injectable({
  providedIn: 'root'
})
export class RouterUtilsService {
  currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
  searchObj = {};

  constructor(
      private router: Router,
      private userService: UserService,
      private cadService: CreditAdministrationService,
      private commonService: CommonService,
      private spinnerService: NgxSpinnerService,
      private toastService: ToastService,
      private nbModal: NgbModal
  ) {
  }

  reloadRoute(submitUrl: string, returnUrl: string) {
    this.router.navigateByUrl(submitUrl).then(value => {
      if (value) {
        this.router.navigate([returnUrl], {});
      }
    });
  }

  reloadCadProfileRoute(cadDocumentId) {
    this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
      if (value) {
        this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
            {
              queryParams: {
                cadDocumentId: cadDocumentId,
              }
            });
      }
    });
  }

  reloadCadProfileRouteWithActiveTab(cadDocumentId, tabId) {
    this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
      if (value) {
        this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
            {
              state: {data: null, tabId: tabId},
              queryParams: {
                cadDocumentId: cadDocumentId,
              }
            });
      }
    });
  }


  routeSummaryWithStateAndEncryptPath(model) {
    this.router.navigate([RouteConst.ROUTE_CAD_SUMMARY, this.encryptUrl(model.id)],
        {state: {data: model}});

  }

  routeSummaryAndEncryptPathID(id) {
    this.router.navigate([RouteConst.ROUTE_CAD_SUMMARY, this.encryptUrl(id)]);

  }

  routeToCustomer(id, customerType, associateId) {
    if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
      this.router.navigate(['/home/customer/profile/' + associateId], {
        queryParams: {
          customerType: customerType,
          customerInfoId: id
        }
      });
    } else if (CustomerType[customerType] === CustomerType.INSTITUTION) {
      this.router.navigate(['/home/customer/company-profile/' + associateId],
          {queryParams: {id: id, customerType: customerType, companyInfoId: associateId, customerInfoId: id}});
    }

  }

  loadProfileWithState(cadDocumentId, model) {
    this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
        {
          state: {data: model},
          queryParams: {
            cadDocumentId: cadDocumentId,
          },

        });
  }

  routeOnConditionProfileOrSummary(cadDocumentId, model) {
    this.userService.getLoggedInUser().subscribe((res: any) => {
      const user: User = res.detail;
      if (user.role.roleType === 'CAD_LEGAL') {
        if (user.role.id.toString() === model.cadCurrentStage.toRole.id.toString()) {
          this.loadProfileWithState(cadDocumentId, model);
        } else {
          this.routeSummaryWithStateAndEncryptPath(model);
        }
      } else if (user.role.roleType === RoleType.CAD_ADMIN || user.role.roleType === RoleType.CAD_SUPERVISOR) {
        this.routeSummaryWithStateAndEncryptPath(model);
      } else {
        if (user.id.toString() === model.cadCurrentStage.toUser.id.toString()) {
          this.loadProfileWithState(cadDocumentId, model);
        } else {
          this.routeSummaryWithStateAndEncryptPath(model);
        }
      }

    });

  }


  routeToLoanSummary(loanConfigId: number, customerId: number) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId,
        catalogue: true
      }
    });
  }

  encryptUrl(id) {
    const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
    return i;
  }

  generateReport(value, status, isCadFile) {
    this.spinnerService.show();
    if (!isCadFile) {
      this.searchObj = Object.assign(value, {docStatus: status});
    } else {
      this.searchObj = Object.assign(value, {isCadFile: 'true'});
    }

    this.cadService.getReport(this.searchObj).subscribe((response: any) => {
      this.commonService.download(response.detail, 'offer pending');
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message === null ? 'Unable to Download ' : error.error.message));
    });
  }


  openLoanListModal(customerLoanList) {
    const modelRef = this.nbModal.open(ApprovedLoanListComponent, {size: 'lg', backdrop: 'static'});
    modelRef.componentInstance.customerLoanList = customerLoanList;
  }

  previewCadDoc(id) {
    const modelRef = this.nbModal.open(PreviewCadComponent, {size: 'xl', backdrop: 'static'});
    modelRef.componentInstance.cadDocumentId = id;
  }
}

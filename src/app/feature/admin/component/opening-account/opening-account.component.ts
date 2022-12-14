import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {Router} from '@angular/router';
import {OpeningForm} from '../../modal/openingForm';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {OpeningAccountService} from './service/opening-account.service';
import {AccountStatus} from '../../modal/accountStatus';
import {RoleType} from '../../modal/roleType';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RemarkModalComponent} from './remark-modal/remark-modal.component';
import {AccountNumberModalComponent} from './account-no-modal/account-no-modal.component';

@Component({
    selector: 'app-opening-account',
    templateUrl: './opening-account.component.html'
})
export class OpeningAccountComponent implements OnInit {
    title = 'Opening Account';
    page = 1;
    search: any = {};
    openingForms: Array<OpeningForm> = new Array<OpeningForm>();
    pageable: Pageable = new Pageable();
    spinner = false;
    totalCount: number;
    pendingCount: number;
    approvalCount: number;
    rejectedCount: number;
    isApproval = false;
    showAction = false;
    searchObject = {
        status: AccountStatus.name(AccountStatus.NEW_REQUEST)
    };
    accountStatusType = AccountStatus;

    constructor(
        private service: OpeningAccountService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router,
    ) {
    }

    static loadData(other: OpeningAccountComponent) {
        other.spinner = true;
        other.service.getStatus().subscribe((res: any) => {
            other.totalCount = res.detail.total;
            other.pendingCount = res.detail.newed;
            other.approvalCount = res.detail.approval;
            other.rejectedCount = res.detail.rejected;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Error loading Account Status Count'));
            other.spinner = false;
        });
        other.service.getPaginationWithSearchObject(other.searchObject, other.page, 10)
        .subscribe((response: any) => {
                other.openingForms = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {
                console.log(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.isApproval = LocalStorageUtil.getStorage().roleType === RoleType.APPROVAL &&
            LocalStorageUtil.getStorage().roleName !== 'admin';
        this.showAction = this.isApproval;
        OpeningAccountComponent.loadData(this);
        this.breadcrumbService.notify(this.title);
    }

    changePage(page: number) {
        this.page = page;
        OpeningAccountComponent.loadData(this);
    }

    onEdit(openingForm: OpeningForm) {
        this.router.navigate(['home/admin/openOpeningAccount'], {queryParams: {openingFormId: openingForm.id}});
    }

    updateStatus(openingForm: OpeningForm, accountStatus) {
        if (accountStatus === 'APPROVAL') {
            const modalRef = this.modalService.open(AccountNumberModalComponent);
            modalRef.componentInstance.openingForm = openingForm;
            modalRef.result.then(() => { this.updateForm(openingForm, accountStatus); }, () => {});
        } else if (accountStatus === 'REJECTED') {
            const modalRef = this.modalService.open(RemarkModalComponent);
            modalRef.componentInstance.openingForm = openingForm;
            modalRef.componentInstance.action = 'Reject';
            modalRef.result.then(() => {this.updateForm(openingForm, accountStatus); }, () => {});
        }
    }

    updateForm(openingForm: OpeningForm, accountStatus) {
        this.service.detail(openingForm.id).subscribe((response: any) => {
            openingForm = response.detail;
            openingForm.status = AccountStatus.name(accountStatus);
            const openingActionDto = {
                'id': openingForm.id,
                actionStatus: accountStatus,
                openingCustomers: openingForm.openingAccount.openingCustomers
            };
            this.service.postAccountOpeningAction(openingActionDto).subscribe(value => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Account Request Status Changed!!!'));
                    OpeningAccountComponent.loadData(this);
                }, error => {
                    console.log(error);
                }
            );
        });
    }

    changeRequest(accountStatus: AccountStatus) {
        this.showAction = this.isApproval && (accountStatus === AccountStatus.NEW_REQUEST);
        this.searchObject.status = AccountStatus.name(accountStatus);
        OpeningAccountComponent.loadData(this);
    }

    openRemarkModal(openingForm) {
       const modalRef = this.modalService.open(RemarkModalComponent);
       modalRef.componentInstance.openingForm = openingForm;
       modalRef.componentInstance.action = 'Follow Up';
       modalRef.result.then(() => { OpeningAccountComponent.loadData(this); }, () => {});
    }
}

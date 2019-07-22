import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {Router} from '@angular/router';
import {Branch} from '../../modal/branch';
import {OpeningForm} from '../../modal/openingForm';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {OpeningAccountService} from './opening-account.service';
import {UserService} from '../user/user.service';
import {AccountStatus} from '../../modal/accountStatus';

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
    branch: Branch = new Branch();
    spinner = false;
    totalCount: number;
    pendingCount: number;
    approvalCount: number;
    rejectedCount: number;
    showApprove = true;
    showReject = true;
    showPending = false;
    accountStatus: AccountStatus = AccountStatus.NEW_REQUEST;
    accountStatusType = AccountStatus;

    constructor(
        private service: OpeningAccountService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router,
        private userService: UserService
    ) {
    }

    static loadData(other: OpeningAccountComponent) {
        other.spinner = true;
        other.service.getStatusByBranch(other.branch.id).subscribe((res: any) => {
            other.totalCount = res.detail.total;
            other.pendingCount = res.detail.newed;
            other.approvalCount = res.detail.approval;
            other.rejectedCount = res.detail.rejected;
        });
        other.service.getByPostOpeningAccount(other.branch, other.page, 10, AccountStatus.name(other.accountStatus))
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
        this.userService.getLoggedInUser().subscribe((response: any) => {
                this.branch = (response.detail.branch)[0];
                OpeningAccountComponent.loadData(this);
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                this.spinner = false;
            }
        );
        this.breadcrumbService.notify(this.title);
    }

    changePage(page: number) {
        this.page = page;
        OpeningAccountComponent.loadData(this);
    }

    onEdit(openingForm: OpeningForm) {
        this.router.navigate(['home/admin/openOpeningAccount'], {queryParams: {openingFormId: openingForm.id}});
    }

    updateStatus(openingForm: OpeningForm, accountStatus: AccountStatus) {
        this.service.detail(openingForm.id).subscribe((response: any) => {
            openingForm = response.detail;
            openingForm.status = AccountStatus.name(accountStatus);
            this.service.update(openingForm.id, openingForm).subscribe((response1: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Account Request Status Changed!!!'));
                    OpeningAccountComponent.loadData(this);
                }, error => {
                    console.log(error);
                }
            );
        });
    }

    changeRequest(accountStatus: AccountStatus) {
        if (accountStatus === AccountStatus.NEW_REQUEST) {
            this.showPending = false;
            this.showApprove = true;
            this.showReject = true;
        } else if (accountStatus === AccountStatus.APPROVAL) {
            this.showPending = true;
            this.showApprove = false;
            this.showReject = true;
        } else if (accountStatus === AccountStatus.REJECTED) {
            this.showPending = true;
            this.showApprove = true;
            this.showReject = false;
        }
        this.accountStatus = accountStatus;
        OpeningAccountComponent.loadData(this);
    }
}

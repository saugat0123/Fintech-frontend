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
        private router: Router
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
        other.service.getPaginationWithSearchObject(other.searchObject, 1, 10)
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
        this.isApproval = localStorage.getItem('roleType') === RoleType.APPROVAL &&
            localStorage.getItem('roleName') !== 'admin';
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
        this.showAction = this.isApproval && (accountStatus === AccountStatus.NEW_REQUEST);
        this.searchObject.status = AccountStatus.name(accountStatus);
        OpeningAccountComponent.loadData(this);
    }
}

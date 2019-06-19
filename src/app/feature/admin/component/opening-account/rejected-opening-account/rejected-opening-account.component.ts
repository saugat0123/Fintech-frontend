import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Branch} from '../../../modal/branch';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {OpeningForm} from '../../../modal/openingForm';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {OpeningAccountService} from '../opening-account.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {UserService} from '../../user/user.service';

@Component({
    selector: 'app-rejected-opening-account',
    templateUrl: './rejected-opening-account.component.html'
})
export class RejectedOpeningAccountComponent implements OnInit {

    title = 'Rejected Opening Account';
    page = 1;
    openingForms: Array<OpeningForm>;
    pageable: Pageable = new Pageable();
    branch: Branch = new Branch();
    spinner = false;
    globalMsg: string;
    total: number;
    pending: number;
    approval: number;
    rejected: number;

    constructor(
        private service: OpeningAccountService,
        private commonPageService: CommonPageService,
        private toastService: ToastService,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private userService: UserService
    ) {
    }

    static loadData(other: RejectedOpeningAccountComponent) {
        other.spinner = true;
        other.service.getByPostOpeningAccount(other.branch, other.page, 10, 'REJECTED').subscribe((response: any) => {
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
        this.breadcrumbService.notify(this.title);
        this.userService.getLoggedInUser().subscribe((response: any) => {
                this.branch = response.detail.branch;
                this.service.getStatusByBranch(this.branch.id).subscribe((res: any) => {
                    this.total = res.detail.total;
                    this.pending = res.detail.newed;
                    this.approval = res.detail.approval;
                    this.rejected = res.detail.rejected;
                });
                RejectedOpeningAccountComponent.loadData(this);
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                this.spinner = false;
            }
        );
    }

    changePage(page: number) {
        this.page = page;
        RejectedOpeningAccountComponent.loadData(this);
    }

    onEdit(openingForm: OpeningForm) {
        this.router.navigate(['home/admin/openOpeningAccount'], {queryParams: {openingFormId: openingForm.id}});
    }

    updateStatus(id, status) {
        this.service.update(id, status).subscribe((response: any) => {
                RejectedOpeningAccountComponent.loadData(this);
            }, error => {
                console.log(error);
            }
        );
    }
}

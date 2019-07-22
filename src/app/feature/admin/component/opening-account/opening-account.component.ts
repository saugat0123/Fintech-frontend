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
    globalMsg: string;
    total: number;
    pending: number;
    approval: number;
    rejected: number;

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
        other.service.getByPostOpeningAccount(other.branch, other.page, 10, 'NEW_REQUEST').subscribe((response: any) => {
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
                this.service.getStatusByBranch(this.branch.id).subscribe((res: any) => {
                    this.total = res.detail.total;
                    this.pending = res.detail.newed;
                    this.approval = res.detail.approval;
                    this.rejected = res.detail.rejected;
                });
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

    updateStatus(id, status) {
        this.service.update(id, status).subscribe((response: any) => {
                OpeningAccountComponent.loadData(this);
            }, error => {
                console.log(error);
            }
        );
    }
}

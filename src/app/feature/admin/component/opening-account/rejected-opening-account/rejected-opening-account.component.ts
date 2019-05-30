import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Branch} from '../../../modal/branch';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {OpeningForm} from '../../../modal/openingForm';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {OpeningAccountService} from '../opening-account.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';

@Component({
    selector: 'app-rejected-opening-account',
    templateUrl: './rejected-opening-account.component.html',
    styleUrls: ['./rejected-opening-account.component.css']
})
export class RejectedOpeningAccountComponent implements OnInit {

    title = 'Rejected Opening Account';
    page = 1;
    openingForms: Array<OpeningForm>;
    currentApi: string;
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
        private breadcrumbService: BreadcrumbService
    ) {
    }

    static loadData(other: RejectedOpeningAccountComponent) {
        other.spinner = true;
        other.service.getA(other.branch, other.page, 10, 'REJECTED').subscribe((response: any) => {
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
        this.service.getStatus().subscribe((response: any) => {
            this.total = response.detail.total;
            this.pending = response.detail.newed;
            this.approval = response.detail.approval;
            this.rejected = response.detail.rejected;
        });
        this.branch.id = 1;
        RejectedOpeningAccountComponent.loadData(this);
    }

    onEdit(openingForm: OpeningForm) {
        this.service.setOpeningForm(openingForm);
        this.router.navigate(['home/admin/openOpeningAccount']);
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

import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Branch} from '../../../modal/branch';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {OpeningForm} from '../../../modal/openingForm';

@Component({
    selector: 'app-rejected-opening-account',
    templateUrl: './rejected-opening-account.component.html',
    styleUrls: ['./rejected-opening-account.component.css']
})
export class RejectedOpeningAccountComponent implements OnInit {

    title = 'Opening Account';
    openingForms: [];
    currentApi: string;
    pageable: Pageable = new Pageable();
    branch: Branch = new Branch();
    spinner = false;
    globalMsg: string;
    total: number;
    newed: number;
    approval: number;
    rejected: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/accountOpening';
        this.getPagination();
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {
            this.total = response.detail.total;
            this.newed = response.detail.newed;
            this.approval = response.detail.approval;
            this.rejected = response.detail.rejected;
            console.log(response);
        });
    }

    getPagination() {
        this.spinner = true;
        this.branch.id = 1;
        this.commonService.getByPostOpeningAccount(this.currentApi + '/get', this.branch, 1, 10, 'REJECTED').subscribe((response: any) => {
                this.openingForms = response.detail.content;
                this.dataService.setDataList(this.openingForms);
                this.commonPageService.setCurrentApi(this.currentApi);
                this.pageable = this.commonPageService.setPageable(response.detail);
                this.spinner = false;
            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
            }
        );
    }

    onEdit(openingForm: OpeningForm) {
        this.dataService.setOpeningForm(openingForm);
        this.router.navigate(['home/admin/openOpeningAccount']);
    }
}

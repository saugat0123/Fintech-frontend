import {Component, DoCheck, OnInit} from '@angular/core';

import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {ApprovalLimit} from '../../../../modal/approval-limit';

declare var $;

@Component({
    selector: 'app-approvallimit',
    templateUrl: './approvallimit.component.html',
    styleUrls: ['./approvallimit.component.css']
})
export class ApprovallimitComponent implements OnInit, DoCheck {
    title = 'ApprovalLimit';
    breadcrumb = 'ApprovalLimit > List';
    dataList: Array<ApprovalLimit>;
    spinner = false;
    globalMsg: string;
    search = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/approvallimit/get';
        this.getPagination();
    }

    onSearch() {
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(approvalLimit: ApprovalLimit) {
        this.dataService.setApprovalLimit(approvalLimit);
        $('.add-approvalLimit').modal('show');
    }

    addApprovalLimit() {
        this.dataService.setApprovalLimit(new ApprovalLimit());
        $('.add-approvalLimit').modal('show');
    }

    getPagination() {
        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
            this.dataList = response.detail.content;
            this.dataService.setDataList(this.dataList);
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
            $('.global-msgModal').modal('show');
        });
    }
}

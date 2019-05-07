import {Component, DoCheck, OnInit} from '@angular/core';

import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {ApprovalLimit} from '../../modal/approval-limit';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddApprovalLimitComponent} from './add-approval-limit/add-approval-limit.component';
import {MsgModalComponent} from '../../../../common/msg-modal/msg-modal.component';
import {BreadcrumbService} from '../../../../common/breadcrum/breadcrumb.service';


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
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    permissions = [];
    viewApprovalLimit = false;
    addViewApprovalLimit = false;
    downloadCsv = false;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/approvallimit/get';

        this.commonService.getByPost('v1/permission/chkPerm', 'APPROVAL LIMIT').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD APPROVAL LIMIT') {
                    this.addViewApprovalLimit = true;
                }
                if (this.permissions[i].type === 'VIEW APPROVAL LIMIT') {
                    this.getPagination();
                    this.viewApprovalLimit = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    this.downloadCsv = true;
                }
            }
        });
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
        this.modalService.open(AddApprovalLimitComponent);
    }

    addApprovalLimit() {
        this.dataService.setApprovalLimit(new ApprovalLimit());
        this.modalService.open(AddApprovalLimitComponent);
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
            this.modalService.open(MsgModalComponent);
        });
    }
}

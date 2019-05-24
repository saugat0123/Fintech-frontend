import {Component, DoCheck, OnInit} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {ApprovalLimit} from '../../modal/approval-limit';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ApprovalLimitFormComponent} from './approval-limit-form/approval-limit-form.component';

@Component({
    selector: 'app-approval-limit',
    templateUrl: './approval-limit.component.html',
})
export class ApprovalLimitComponent implements OnInit, DoCheck {
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
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;
            other.dataService.setDataList(other.dataList);
            other.commonPageService.setCurrentApi(other.currentApi);
            other.pageable = other.commonPageService.setPageable(response.detail);
            other.spinner = false;
        }, error => {

            const alert = new Alert(AlertType.ERROR, error.error.message);
            other.toastService.show(alert);

            other.spinner = false;
        });
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
                    ApprovalLimitComponent.loadData(this);
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
        ApprovalLimitComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        ApprovalLimitComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(approvalLimit: ApprovalLimit) {
        this.dataService.setApprovalLimit(approvalLimit);
        ModalUtils.resolve(this.modalService.open(ApprovalLimitFormComponent, {size: 'lg'}).result, ApprovalLimitComponent.loadData, this);
    }

    addApprovalLimit() {
        this.dataService.setApprovalLimit(new ApprovalLimit());
        ModalUtils.resolve(this.modalService.open(ApprovalLimitFormComponent, {size: 'lg'}).result, ApprovalLimitComponent.loadData, this);
    }
}

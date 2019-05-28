import {Component, OnInit} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ApprovalLimit} from '../../modal/approval-limit';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ApprovalLimitFormComponent} from './approval-limit-form/approval-limit-form.component';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ApprovalLimitService} from './approval-limit.service';
import {PermissionService} from '../../../../@core/service/permission.service';

@Component({
    selector: 'app-approval-limit',
    templateUrl: './approval-limit.component.html',
})
export class ApprovalLimitComponent implements OnInit {

    page = 1;
    title = 'ApprovalLimit';
    breadcrumb = 'ApprovalLimit > List';

    dataList: Array<ApprovalLimit> = new Array<ApprovalLimit>();
    spinner = false;
    search: any = {};
    pageable: Pageable = new Pageable();

    activeCount: number;
    inactiveCount: number;
    permissions = [];
    viewApprovalLimit = false;
    addViewApprovalLimit = false;
    downloadCsv = false;

    constructor(
        private service: ApprovalLimitService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: ApprovalLimitComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            const alert = new Alert(AlertType.ERROR, error.error.message);
            other.toastService.show(alert);
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.permissionService.getPermissionOf('APPROVAL LIMIT').subscribe((response: any) => {
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

    changePage(page: number) {
        this.page = page;
        ApprovalLimitComponent.loadData(this);
    }

    onSearch() {
        ApprovalLimitComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        ApprovalLimitComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(ApprovalLimitFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = new ApprovalLimit();

        ModalUtils.resolve(modalRef.result, ApprovalLimitComponent.loadData, this);
    }

    edit(approvalLimit: ApprovalLimit) {
        const modalRef = this.modalService.open(ApprovalLimitFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = approvalLimit;
        ModalUtils.resolve(modalRef.result, ApprovalLimitComponent.loadData, this);
    }
}

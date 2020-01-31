import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BreadcrumbService} from '../../../@theme/components/breadcrum/breadcrumb.service';
import {ApprovalRoleHierarchyService} from './approval-role-hierarchy.service';
import {RoleService} from '../../admin/component/role-permission/role.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ApprovalRoleHierarchy} from './ApprovalRoleHierarchy';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-approval-role-hierarchy',
    templateUrl: './approval-role-hierarchy.component.html',
    styleUrls: ['./approval-role-hierarchy.component.scss']
})
export class ApprovalRoleHierarchyComponent implements OnInit {
    defaultRoleHierarchies = [];
    approvalRoleHierarchies = [];
    spinner = false;
    isDisabled = false;
    tempRoleOrders: ApprovalRoleHierarchy[];
    length = false;
    title = 'Approval Role Hierarchy';
    approvalType: string;
    refId: number;

    constructor(
        private route: ActivatedRoute,
        private service: ApprovalRoleHierarchyService,
        private roleService: RoleService,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }


    ngOnInit() {

        this.breadcrumbService.notify(this.title);
        this.route.paramMap.subscribe(paramsMap => {
            this.approvalType = paramsMap.get('type');
            this.refId = +paramsMap.get('refId');

            this.service.findAll(this.approvalType, this.refId).subscribe((response: any) => {
                this.defaultRoleHierarchies = response.detail;
                this.length = this.defaultRoleHierarchies.length > 0;
                this.approvalRoleHierarchies = this.defaultRoleHierarchies;
            });
        });
    }


    drop(event: CdkDragDrop<ApprovalRoleHierarchy[]>) {
        this.approvalRoleHierarchies = [];

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }

        this.tempRoleOrders = event.container.data;
        for (let x = 0; x < this.tempRoleOrders.length; x++) {
            this.tempRoleOrders[x].roleOrder = x + 1;
            this.approvalRoleHierarchies.push(this.tempRoleOrders[x]);
            this.defaultRoleHierarchies = this.approvalRoleHierarchies;
        }
    }

    removeItem(index: number) {
        console.log(this.approvalRoleHierarchies.splice(index, 1));
    }

    save() {
        this.spinner = true;
        this.isDisabled = true;
        this.service.saveAll(this.approvalRoleHierarchies).subscribe((response: any) => {
            this.isDisabled = false;
            this.spinner = false;
            this.defaultRoleHierarchies = response.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Approval Role Order!'));
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while saving Approval Role Order'));
            this.isDisabled = false;
            this.spinner = false;
        });
    }

    reset() {
        this.service.getDefault(this.approvalType, this.refId).subscribe((res: any) => {
            this.defaultRoleHierarchies = res.detail;
            this.approvalRoleHierarchies = this.defaultRoleHierarchies;
        }, error => {
            this.defaultRoleHierarchies = [];
            this.approvalRoleHierarchies = [];
        });
    }
}
